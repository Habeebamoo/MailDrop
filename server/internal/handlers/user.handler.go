package handlers

import (
	"fmt"
	"net/http"

	"github.com/Habeebamoo/MailDrop/server/internal/models"
	"github.com/Habeebamoo/MailDrop/server/internal/service"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type UserHandler struct {
	svc service.UserService
}

func NewUserHandler(svc service.UserService) UserHandler {
	return UserHandler{svc: svc}
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

	c.JSON(statusCode, gin.H{"message": "Registeration Successful"})
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

	//cookies
	cookieName := "auth_token"
	path := "/"
	domain := ""
	maxAge := 3600

	c.SetCookie(cookieName, token, maxAge, path, domain, true, true)
	c.Header("Set-Cookie", 
		cookieName+"="+token+
		"; Path="+path+
		"; Domain="+domain+
		"; Max-Age="+fmt.Sprint(maxAge)+
		"; Secure"+
		"; HttpOnly"+
		"; SameSite=None"+
		"; Partitioned",
	)
	
	c.JSON(statusCode, gin.H{"message": "Login Successful"})
}

func (usrHdl *UserHandler) GetUser(c *gin.Context) {
	raw, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized Access"})
		return
	}

	userId := raw.(uuid.UUID)
	user, statusCode, err := usrHdl.svc.GetUser(userId)
	if err != nil {
		c.JSON(statusCode, gin.H{"error": err.Error()})
		return
	}

	c.JSON(statusCode, user)
}