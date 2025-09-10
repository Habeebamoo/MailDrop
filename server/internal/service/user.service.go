package service

import (
	"fmt"
	"net/http"
	"time"

	"github.com/Habeebamoo/MailDrop/server/internal/models"
	"github.com/Habeebamoo/MailDrop/server/internal/repositories"
	"github.com/Habeebamoo/MailDrop/server/internal/utils"
	"github.com/google/uuid"
)

type UserService interface {
	CreateUser(*models.UserRequest) (int, error)
	LoginUser(*models.UserLogin) (string, int, error)
	HandleGoogleLogin(models.GoogleLoginRequest) (string, int, error)
	VerifyUser(int) (int, error)
	GetUser(uuid.UUID) (models.UserResponse, int, error)
	GetActivities(uuid.UUID) ([]models.ActivityResponse, int, error)
	UpdateProfile(models.ProfileRequest) (int, error)
	UpdateProfileWithImage(models.ProfileRequestImage) (int, error)
	ForgotPassword(string) (int, error)
	ResetPassword(string, string) (int, error)
}

type UserSvc struct {
	repo repositories.UserRepository
}

func NewUserService(repo repositories.UserRepository) UserService {
	return &UserSvc{repo: repo}
}

func (userSvc *UserSvc) CreateUser(userReq *models.UserRequest) (int, error) {
	//assing user request to user struct
	user := &models.User{
		Name: userReq.Name,
		Email: userReq.Email,
		Password: userReq.Password,
		Verified: false,
		CreatedAt: time.Now(),
	}

	//update hashed password
	hashedPassword, _ := utils.HashPassword(userReq.Password)
	user.Password = hashedPassword

	//create user
	statusCode, err := userSvc.repo.InsertUser(user, "")
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

func (userSvc *UserSvc) LoginUser(userReq *models.UserLogin) (string, int, error) {
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

		err = utils.ResendVerificationEmail(user.Name, user.Email, otp)
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

func (userSvc *UserSvc) HandleGoogleLogin(userInfo models.GoogleLoginRequest) (string, int, error) {
	//checks if user exists
	existingUser, code, err := userSvc.repo.GetUser(userInfo.Email)

	if code == 500 {
		return "", code, err
	}

	if code == 200 {
		//login user
		token, err := utils.GenerateJWT(existingUser.UserId)
		if err != nil {
			return "", 500, err
		}
		
		return token, 200, nil
	}

	//create user
	user := &models.User{
		Name: userInfo.Name,
		Email: userInfo.Email,
		Verified: true,
		CreatedAt: time.Now(),
	}

	code, err = userSvc.repo.InsertUser(user, userInfo.Picture)
	if err != nil {
		return "", code, err
	}

	//login user
	token, err := utils.GenerateJWT(user.UserId)
	if err != nil {
		return "", 500, err
	}
	
	return token, 200, nil
}

func (userSvc *UserSvc) VerifyUser(otpCode int) (int, error) {
	//get the user associated with the token
	userOtp, statusCode, err := userSvc.repo.GetUserByOTP(otpCode)
	if err != nil {
		return statusCode, err
	}

	if time.Now().After(userOtp.ExpiresAt) {
		return http.StatusNotAcceptable, fmt.Errorf("code is expired")
	}

	//verify the user
	statusCode, err = userSvc.repo.VerifyEmail(userOtp.UserId)
	if err != nil {
		return statusCode, err
	}

	//delete otp
	return userSvc.repo.DeleteOTP(userOtp.UserId)
}

func (userSvc *UserSvc) GetUser(userId uuid.UUID) (models.UserResponse, int, error) {
	user, statusCode, err := userSvc.repo.GetUserById(userId)
	if err != nil {
		return models.UserResponse{}, statusCode, err
	}

	userResponse := models.UserResponse{
		UserId: user.UserId,
		Name: user.Name,
		Email: user.Email,
		Verified: user.Verified,
		Profile: models.ProfileResponse{
			ProfilePic: user.Profile.ProfilePic,
			Bio: user.Profile.Bio,
			TotalCampaigns: user.Profile.TotalCampaigns,
			TotalSubscribers: user.Profile.TotalSubscribers,
			TotalEmails: user.Profile.TotalEmails,
			TotalClicks: user.Profile.TotalClicks,
		},
	}

	return userResponse, 200, nil
}

func (userSvc *UserSvc) GetActivities(userId uuid.UUID) ([]models.ActivityResponse, int, error) {
	return userSvc.repo.GetActivities(userId)
}

func (userSvc *UserSvc) UpdateProfile(profileReq models.ProfileRequest) (int, error) {
	return userSvc.repo.UpdateProfile(profileReq.UserId, profileReq.Name, profileReq.Bio)
}

func (userSvc *UserSvc) UpdateProfileWithImage(profileReq models.ProfileRequestImage) (int, error) {
	//open the file
	f, err := profileReq.Image.Open()
	if err != nil {
		return 500, fmt.Errorf("cannot open file")
	}
	defer f.Close()

	//upload profile picture
	profileUrl, err := utils.UploadPic(f)
	if err != nil {
		return 500, err
	}

	return userSvc.repo.UpdateProfileWithImage(profileReq.UserId, profileReq.Name, profileReq.Bio, profileUrl)
}

func (userSvc *UserSvc) ForgotPassword(email string) (int, error) {
	//check if user exists
	exists := userSvc.repo.Exists(email)

	//not giving user-info to unauthorzied people :)
	if (!exists) {
		return 200, nil
	}

	//get the user
	user, _, err := userSvc.repo.GetUser(email)
	if err != nil {
		return 500, fmt.Errorf("internal server error")
	}

	//create a token to associate with the user
	token, _ := utils.GetRandomString()

	statusCode, err := userSvc.repo.CreateToken(user.UserId, token)
	if err != nil {
		return statusCode, err
	}

	//send password reset link to the user's email
	return utils.SendPasswordResetEmail(user.Name, user.Email, token)
}

func (userSvc *UserSvc) ResetPassword(token string, newPassword string) (int, error) {
	//get the user associated with the token
	userToken, statusCode, err := userSvc.repo.GetUserIdByToken(token)
	if err != nil {
		return statusCode, err
	}

	if time.Now().After(userToken.ExpiresAt) {
		return http.StatusNotAcceptable, fmt.Errorf("token is expired")
	}

	//hash new password
	newHashedPassword, _ := utils.HashPassword(newPassword)

	//update the users password
	statusCode, err = userSvc.repo.UpdatePassword(userToken.UserId, newHashedPassword)
	if err != nil {
		return statusCode, err
	}

	//delete token
	return userSvc.repo.DeleteToken(userToken.UserId)
}
