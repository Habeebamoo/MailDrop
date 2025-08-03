package service

import (
	"fmt"
	"net/http"

	"github.com/Habeebamoo/MailDrop/internal/models"
	"github.com/Habeebamoo/MailDrop/internal/repositories"
	"github.com/Habeebamoo/MailDrop/internal/utils"
)

type UserService interface {
	CreateUser(models.UserRequest) (int, error)
	LoginUser(models.UserLogin) (string, int, error)
}

type UserSvc struct {
	repo repositories.UserRepository
}

func NewUserService(repo repositories.UserRepository) UserService {
	return &UserSvc{repo: repo}
}

func (userSvc *UserSvc) CreateUser(userReq models.UserRequest) (int, error) {
	hashedPassword, _ := utils.HashPassword(userReq.Password)
	userReq.Provider = "email"
	userReq.Password = hashedPassword

	return userSvc.repo.InsertUser(userReq)
}

func (userSvc *UserSvc) LoginUser(userReq models.UserLogin) (string, int, error) {
	user, statusCode, err := userSvc.repo.GetUser(userReq.Email)
	if err != nil {
		return "", statusCode, err
	}

	if err := utils.VerifyPassword(user.Password, userReq.Password); err != nil {
		return "", http.StatusUnauthorized, fmt.Errorf("invalid credentials")
	}

	token, _ := utils.GenerateJWT(user.UserId)
	return token, 200, nil
}