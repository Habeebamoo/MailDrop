package handlers

import (
	"net/http"

	"github.com/Habeebamoo/MailDrop/internal/models"
	"github.com/Habeebamoo/MailDrop/internal/service"
	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	svc service.UserService
}

func NewUserHandler(svc service.UserService) UserHandler {
	return  UserHandler{svc: svc}
} 

func (usrHdl *UserHandler) Register(c *gin.Context) {
	var userReq models.UserRequest
	if err := c.ShouldBindJSON(&userReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	statusCode, err := usrHdl.svc.CreateUser(userReq)
	if err != nil {
		c.JSON(statusCode, gin.H{"error": err.Error()})
		return
	}

	c.JSON(statusCode, gin.H{"error": "Registeration Successful"})
}

func (usrHdl *UserHandler) Login(c *gin.Context) {
	var userReq models.UserLogin
	if err := c.ShouldBindJSON(&userReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	token, statusCode, err := usrHdl.svc.LoginUser(userReq)
	if err != nil {
		c.JSON(statusCode, gin.H{"error": err.Error()})
		return
	}

	c.SetCookie("auth_token", token, 3600, "/", "localhost", false, true)
	c.JSON(statusCode, gin.H{"message": "Login Successful"})
}

func (usrHdl *UserHandler) GetUser(c *gin.Context) {
	
}