package service

import (
	"fmt"
	"net/http"

	"github.com/Habeebamoo/MailDrop/server/internal/models"
	"github.com/Habeebamoo/MailDrop/server/internal/repositories"
	"github.com/Habeebamoo/MailDrop/server/internal/utils"
	"github.com/google/uuid"
)

type UserService interface {
	CreateUser(models.UserRequest) (int, error)
	LoginUser(models.UserLogin) (string, int, error)
	GetUser(uuid.UUID) (models.User, int, error)
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