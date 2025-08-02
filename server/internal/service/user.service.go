package service

import "github.com/Habeebamoo/MailDrop/internal/repositories"

type UserService interface {
	Testing()
}

type UserSvc struct {
	repo repositories.UserRepository
}

func NewUserService(repo repositories.UserRepository) UserService {
	return &UserSvc{repo: repo}
}

func (userSvc *UserSvc) Testing() {

}