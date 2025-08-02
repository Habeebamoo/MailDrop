package handlers

import (
	"github.com/Habeebamoo/MailDrop/internal/service"
	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	svc service.UserService
}

func NewUserHandler(svc service.UserService) UserHandler {
	return  UserHandler{svc: svc}
} 

func (u *UserHandler) Register(c *gin.Context) {

}

func (u *UserHandler) Login(c *gin.Context) {

}