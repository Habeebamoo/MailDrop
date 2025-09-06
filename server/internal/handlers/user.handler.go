package handlers

import (
	"net/http"
	"strconv"
	"time"

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
	userReq := &models.UserRequest{}
	if err := c.ShouldBindJSON(&userReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := userReq.ValidateUserRequest(); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": Capitalize(err.Error(), false)})
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
	userReq := &models.UserLogin{}
	if err := c.ShouldBindJSON(&userReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := userReq.ValidateLoginRequest(); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": Capitalize(err.Error(), false)})
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

	http.SetCookie(c.Writer, &http.Cookie{
		Name: cookieName,
		Value: token,
		MaxAge: maxAge,
		Path: path,
		Domain: domain,
		Secure: true,
		HttpOnly: true,
		SameSite: http.SameSiteNoneMode,
		Partitioned: true,
	})
	
	c.JSON(statusCode, gin.H{"message": "Login Successful"})
}

func (usrHdl *UserHandler) GoogleLogin(c *gin.Context) {
	var userReq models.GoogleLoginRequest
	if err := c.ShouldBindJSON(&userReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// handle user request
	token, statusCode, err := usrHdl.svc.HandleGoogleLogin(userReq)
	if err != nil {
		c.JSON(statusCode, gin.H{"error": Capitalize(err.Error(), false)})
		return
	}

	//cookies
	cookieName := "auth_token"
	path := "/"
	domain := ""
	maxAge := 3600

	http.SetCookie(c.Writer, &http.Cookie{
		Name: cookieName,
		Value: token,
		MaxAge: maxAge,
		Path: path,
		Domain: domain,
		Secure: true,
		HttpOnly: true,
		SameSite: http.SameSiteNoneMode,
		Partitioned: true,
	})
	
	c.JSON(statusCode, gin.H{"message": "Login Successful"})
}

func (usrHdl *UserHandler) VerifyOTP(c *gin.Context) {
	otpCodeStr := c.Query("code")
	if otpCodeStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "OTP Code is missing"})
		return
	}

	otpCode, err := strconv.Atoi(otpCodeStr)
	if err != nil {
		c.JSON(500, gin.H{"error": "Internal server error"})
		return
	}

	statusCode, err := usrHdl.svc.VerifyUser(otpCode)
	if err != nil {
		c.JSON(statusCode, gin.H{"error": Capitalize(err.Error(), false)})
		return
	}

	c.JSON(statusCode, gin.H{"message": "Verification Successfull"})
}

func (userHdl *UserHandler) Logout(c *gin.Context) {
	//overide the cookie
	cookieName := "auth_token"
	path := "/"
	domain := ""
	maxAge := -1

	http.SetCookie(c.Writer, &http.Cookie{
		Name: cookieName,
		Value: "",
		MaxAge: maxAge,
		Expires: time.Unix(0, 0),
		Path: path,
		Domain: domain,
		Secure: true,
		HttpOnly: true,
		SameSite: http.SameSiteNoneMode,
		Partitioned: true,
	})

	c.JSON(200, gin.H{"message": "Signed out successfully"})
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
	bio := c.PostForm("bio")
	
	if name == "" || bio == "" {
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
	Request := &models.ForgotPasswordRequest{}
	if err := c.ShouldBindJSON(&Request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := Request.ValidateRequest(); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": Capitalize(err.Error(), false)})
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
	Request := &models.ResetPasswordRequest{}
	if err := c.ShouldBindJSON(&Request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := Request.ValidateRequest(); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": Capitalize(err.Error(), false)})
		return
	}

	statusCode, err := userHdl.svc.ResetPassword(Request.Token, Request.Password)
	if err != nil {
		c.JSON(statusCode, gin.H{"error": Capitalize(err.Error(), false)})
		return	
	}

	c.JSON(statusCode, gin.H{"message": "New Password has been updated"})
}