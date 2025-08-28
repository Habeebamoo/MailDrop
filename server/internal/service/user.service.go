package service

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"

	"github.com/Habeebamoo/MailDrop/server/internal/models"
	"github.com/Habeebamoo/MailDrop/server/internal/repositories"
	"github.com/Habeebamoo/MailDrop/server/internal/utils"
	"github.com/google/uuid"
)

type UserService interface {
	CreateUser(models.UserRequest) (int, error)
	LoginUser(models.UserLogin) (string, int, error)
	VerifyUser(int) (int, error)
	GetUser(uuid.UUID) (models.User, int, error)
	GetActivities(uuid.UUID) ([]models.ActivityResponse, int, error)
	UpdateProfile(models.ProfileRequest) (int, error)
	ForgotPassword(string) (int, error)
	ResetPassword(uuid.UUID, string) (int, error)
}

type UserSvc struct {
	repo repositories.UserRepository
}

func NewUserService(repo repositories.UserRepository) UserService {
	return &UserSvc{repo: repo}
}

func (userSvc *UserSvc) CreateUser(userReq models.UserRequest) (int, error) {
	//assing user request to user struct
	user := models.User{
		Name: userReq.Name,
		Email: userReq.Email,
		Password: userReq.Password,
		AuthType: userReq.AuthType,
		Verified: false,
		CreatedAt: time.Now(),
	}

	//update hashed password
	hashedPassword, _ := utils.HashPassword(userReq.Password)
	user.Password = hashedPassword
	user.AuthType = "email"

	//create user
	statusCode, err := userSvc.repo.InsertUser(user)
	if err != nil {
		return statusCode, err
	}

	//create OTP mail
	otp, err := userSvc.repo.CreateOTP(user.UserId)
	if err != nil {
		return 500, err
	}

	err = utils.SendVerificationEmail(userReq.Name, userReq.Email, otp)
	if err != nil {
		return 500, err
	}

	return statusCode, nil
}

func (userSvc *UserSvc) LoginUser(userReq models.UserLogin) (string, int, error) {
	user, statusCode, err := userSvc.repo.GetUser(userReq.Email)
	if err != nil {
		return "", statusCode, err
	}

	//checks if the user is verified & send OTP mail
	if !user.Verified {
		otp, err := userSvc.repo.CreateOTP(user.UserId)
		if err != nil {
			return "", 500, err
		}

		err = utils.SendVerificationEmail(user.Name, user.Email, otp)
		if err != nil {
			return "", 500, fmt.Errorf("internal server error")
		}

		return "", http.StatusUnauthorized, fmt.Errorf("email not verified. Please check your inbox to verify")
	}

	if err := utils.VerifyPassword(user.Password, userReq.Password); err != nil {
		return "", http.StatusUnauthorized, fmt.Errorf("invalid credentials")
	}

	token, err := utils.GenerateJWT(user.UserId)
	if err != nil {
		return "", 500, err
	}
	
	return token, 200, nil
}

func (userSvc *UserSvc) VerifyUser(otpCode int) (int, error) {
	//get the user associated with the token
	userId, statusCode, err := userSvc.repo.GetUserIdByOTP(otpCode)
	if err != nil {
		return statusCode, err
	}

	//get the user
	user, statusCode, err := userSvc.repo.GetUserById(userId)
	if err != nil {
		return 500, fmt.Errorf("internal server error")
	}

	if user.Verified {
		return 200, nil
	}

	//verify the user
	return userSvc.repo.VerifyEmail(userId)
}

func (userSvc *UserSvc) GetUser(userId uuid.UUID) (models.User, int, error) {
	return userSvc.repo.GetUserById(userId)
}

func (userSvc *UserSvc) GetActivities(userId uuid.UUID) ([]models.ActivityResponse, int, error) {
	return userSvc.repo.GetActivities(userId)
}

func (userSvc *UserSvc) UpdateProfile(profileReq models.ProfileRequest) (int, error) {
	ref := os.Getenv("SUPABASE_ID")

	//open the file
	f, err := profileReq.Image.Open()
	if err != nil {
		return 500, fmt.Errorf("cannot open file")
	}
	defer f.Close()

	fileBytes, err := io.ReadAll(f)
	if err != nil {
		return 500, fmt.Errorf("cannot read file")
	}

	bucket := "profile-pictures"
	filePath := fmt.Sprintf("%s_%s", profileReq.UserId.String(), profileReq.Image.Filename) 
	url := os.Getenv("SUPABASE_URL")
	key := os.Getenv("SUPABASE_KEY")

	//upload url
	uploadUrl := fmt.Sprintf("%s/storage/v1/object/%s/%s", url, bucket, filePath)

	//request to Supabase storage API
	req, err := http.NewRequest("POST", uploadUrl, io.NopCloser(io.Reader(bytes.NewReader(fileBytes))))
	if err != nil {
		return 500, fmt.Errorf("request build failed")
	}

	//add headers
	req.Header.Set("Authorization", "Bearer "+key)
	req.Header.Set("Content-Type", "application/octet-stream")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return 500, fmt.Errorf("upload error")
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
		return 500, fmt.Errorf("upload failed")
	}

	//get the url
	profileUrl := fmt.Sprintf("https://%s.supabase.co/storage/v1/object/public/%s/%s", ref, bucket, filePath)

	//update user profile
	detailsReq := models.ProfileDetailsRequest{
		UserId: profileReq.UserId,
		Name: profileReq.Name,
		Email: profileReq.Email,
		Bio: profileReq.Bio,
		Image: profileUrl,
	}

	return userSvc.repo.UpdateProfile(detailsReq)
}

func (userSvc *UserSvc) ForgotPassword(email string) (int, error) {
	//check if user exists
	exists := userSvc.repo.Exists(email)

	//not giving user-info about users to unauthorzied people :)
	if (!exists) {
		return 200, nil
	}

	//get the user
	user, _, err := userSvc.repo.GetUser(email)
	if err != nil {
		return 500, fmt.Errorf("internal server error")
	}

	//create a token to associate with the user
	token, statusCode, err := userSvc.repo.CreateToken(user.UserId)
	if err != nil {
		return statusCode, err
	}

	//send password reset link to the user's email
	return utils.SendPasswordResetEmail(user.Name, user.Email, token)
}

func (userSvc *UserSvc) ResetPassword(token uuid.UUID, newPassword string) (int, error) {
	//get the user associated with the token
	userToken, statusCode, err := userSvc.repo.GetUserIdByToken(token)
	if err != nil {
		return statusCode, err
	}

	if time.Now().UTC().After(userToken.ExpiresAt.UTC()) {
		return http.StatusNotAcceptable, fmt.Errorf("token is expired")
	}

	//update the users password
	return userSvc.repo.UpdatePassword(userToken.UserId, newPassword)
}
