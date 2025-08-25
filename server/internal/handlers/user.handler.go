package handlers

import (
	"fmt"
	"net/http"

	"github.com/Habeebamoo/MailDrop/server/internal/models"
	"github.com/Habeebamoo/MailDrop/server/internal/service"
	"github.com/Habeebamoo/MailDrop/server/internal/utils"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type UserHandler struct {
	svc service.UserService
}

func NewUserHandler(svc service.UserService) UserHandler {
	return UserHandler{svc: svc}
} 

var (
	Capitalize = utils.Capitalize
)

func (usrHdl *UserHandler) Register(c *gin.Context) {
	var userReq models.UserRequest
	if err := c.ShouldBindJSON(&userReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	statusCode, err := usrHdl.svc.CreateUser(userReq)
	if err != nil {
		c.JSON(statusCode, gin.H{"error": Capitalize(err.Error(), false)})
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
		c.JSON(statusCode, gin.H{"error": Capitalize(err.Error(), false)})
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

func (userHdl *UserHandler) Logout(c *gin.Context) {
	//overide the cookie
	cookieName := "auth_token"
	path := "/"
	domain := ""
	maxAge := -1

	c.SetCookie(cookieName, "", maxAge, path, domain, true, true)
	c.Header("Set-Cookie", 
		cookieName+"="+""+
		"; Path="+path+
		"; Domain="+domain+
		"; Max-Age="+fmt.Sprint(maxAge)+
		"; Secure"+
		"; HttpOnly"+
		"; SameSite=None"+
		"; Partitioned",
	)

	c.JSON(200, gin.H{"message": "Signed out Successfully"})
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
		c.JSON(statusCode, gin.H{"error": Capitalize(err.Error(), false)})
		return
	}

	c.JSON(statusCode, user)
}

func (usrHdl *UserHandler) GetActivities(c *gin.Context) {
	raw, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized Access"})
		return
	}

	userId := raw.(uuid.UUID)
	userActivities, statusCode, err := usrHdl.svc.GetActivities(userId)
	if err != nil {
		c.JSON(statusCode, gin.H{"error": err.Error()})
		return
	}

	c.JSON(statusCode, userActivities)
}

func (usrHdl *UserHandler) UpdateProfile(c *gin.Context) {
	raw, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized Access"})
		return
	}

	userId := raw.(uuid.UUID)

	name := c.PostForm("name")
	email := c.PostForm("email")
	bio := c.PostForm("bio")
	if (name == "" || email == "" || bio == "") {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No field must be empty"})
		return
	}

	image, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": Capitalize(err.Error(), false)})
		return
	}

	if image.Size > 5 << 20 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Image must be 5MB or less"})
	}

	profileReq := models.ProfileRequest{
		UserId: userId,
		Image: image,
		Name: name,
		Email: email,
		Bio: bio,
	}

	statusCode, err := usrHdl.svc.UpdateProfile(profileReq)
	if err != nil {
		c.JSON(statusCode, gin.H{"error": Capitalize(err.Error(), false)})
		return
	}

	c.JSON(statusCode, gin.H{"message": "Profile Updated Successfully"})
}

func (userHdl *UserHandler) ForgotPassword(c *gin.Context) {
	var Request models.ForgotPasswordRequest
	if err := c.ShouldBindJSON(&Request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	statusCode, err := userHdl.svc.ForgotPassword(Request.Email)
	if err != nil {
		c.JSON(statusCode, gin.H{"error": Capitalize(err.Error(), false)})
		return
	}

	c.JSON(statusCode, gin.H{"message": "If this user exists, a reset link will be sent to this email"})
}

func (userHdl *UserHandler) ResetPassword(c *gin.Context) {
	var Request models.ResetPasswordRequest
	if err := c.ShouldBindJSON(&Request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	token, _ := uuid.Parse(Request.Token)
	newPassword := Request.Password

	statusCode, err := userHdl.svc.ResetPassword(token, newPassword)
	if err != nil {
		c.JSON(statusCode, gin.H{"error": Capitalize(err.Error(), false)})
		return	
	}

	c.JSON(statusCode, gin.H{"message": "New Password has been updated"})
}