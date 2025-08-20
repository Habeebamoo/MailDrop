package service

import (
	"fmt"
	"net/http"
	"os"

	"github.com/Habeebamoo/MailDrop/server/internal/models"
	"github.com/Habeebamoo/MailDrop/server/internal/repositories"
	"github.com/Habeebamoo/MailDrop/server/internal/utils"
	"github.com/google/uuid"
	"github.com/supabase-community/storage-go"
)

type UserService interface {
	CreateUser(models.UserRequest) (int, error)
	LoginUser(models.UserLogin) (string, int, error)
	GetUser(uuid.UUID) (models.User, int, error)
	GetActivities(uuid.UUID) ([]models.ActivityResponse, int, error)
	UpdateProfile(models.ProfileRequest) (int, error)
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
	}

	//update hashed password
	hashedPassword, _ := utils.HashPassword(userReq.Password)
	user.Password = hashedPassword
	user.AuthType = "email"

	return userSvc.repo.InsertUser(user)
}

func (userSvc *UserSvc) LoginUser(userReq models.UserLogin) (string, int, error) {
	user, statusCode, err := userSvc.repo.GetUser(userReq.Email)
	if err != nil {
		return "", statusCode, err
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

func (userSvc *UserSvc) GetUser(userId uuid.UUID) (models.User, int, error) {
	return userSvc.repo.GetUserById(userId)
}

func (userSvc *UserSvc) GetActivities(userId uuid.UUID) ([]models.ActivityResponse, int, error) {
	return userSvc.repo.GetActivities(userId)
}

func (userSvc *UserSvc) UpdateProfile(profileReq models.ProfileRequest) (int, error) {
	//setup supabase storage client
	url := os.Getenv("SUPABASE_URL")
	key := os.Getenv("SUPBASE_SERVICE_KEY_ROLE")
	client := storage_go.NewClient(url, key, nil)

	//open the file
	f, err := profileReq.Image.Open()
	if err != nil {
		return 500, fmt.Errorf("cannot open file")
	}
	defer f.Close()

	//upload file to supabse bucket
	objectName := fmt.Sprintf("%s_%s", profileReq.UserId.String(), profileReq.Image.Filename) 

	_, err = client.UploadFile(
		"profile-pictures", 
		objectName, 
		f, 
	)

	if err != nil {
		return 500, err
	}

	//get public url
	publicUrl := client.GetPublicUrl("profile-pictures", objectName)
	profileUrl := publicUrl.SignedURL


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
