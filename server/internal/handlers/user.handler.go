package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/Habeebamoo/MailDrop/server/internal/models"
	"github.com/Habeebamoo/MailDrop/server/internal/service"
	"github.com/Habeebamoo/MailDrop/server/internal/utils"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"golang.org/x/oauth2"
)

type UserHandler struct {
	svc service.UserService
	googleOauth2Config *oauth2.Config
}

func NewUserHandler(svc service.UserService, googleOauth2Config *oauth2.Config) UserHandler {
	return UserHandler{svc: svc, googleOauth2Config: googleOauth2Config}
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

func (usrHdl *UserHandler) GoogleLogin(c *gin.Context) {
	state, _ := utils.GetRandomString()
	c.SetCookie("oauthstate", state, 3600, "/", "", true, true)

	url := usrHdl.googleOauth2Config.AuthCodeURL(state, oauth2.AccessTypeOffline)
	c.Redirect(http.StatusTemporaryRedirect, url)
}

func (usrHdl *UserHandler) GoogleCallBack(c *gin.Context) {
	callbackState := c.Query("state")
	cookieState, err := c.Cookie("oauthstate")
	if err != nil {
		c.JSON(500, gin.H{"error": "Internal server error"})
		return
	}

	if cookieState != callbackState {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid state"})
		return
	}
		
	code := c.Query("code")
	if code == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "code not found in URL"})
		return
	}

	//exchange the code for an access token
	token, err := usrHdl.googleOauth2Config.Exchange(context.Background(), code)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to exchange token"})
		return
	}

	client := usrHdl.googleOauth2Config.Client(context.Background(), token)

	//make a request to google people api
	resp, err := client.Get("https://www.googleapis.com/oauth2/v2/userinfo")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get user info"})
		return
	}
	defer resp.Body.Close()

	//get users credentials
	var userInfo models.GoogleLoginRequest
	if err := json.NewDecoder(resp.Body).Decode(&userInfo); err != nil {
		c.JSON(500, gin.H{"error": "failed to parse user info"})
		return
	}

	// handle user request
	jwtToken, statusCode, err := usrHdl.svc.HandleGoogleLogin(userInfo)
	if err != nil {
		c.JSON(statusCode, gin.H{"error": Capitalize(err.Error(), false)})
		return
	}

	//cookies
	cookieName := "auth_token"
	path := "/"
	domain := ""
	maxAge := 3600

	c.SetCookie(cookieName, jwtToken, maxAge, path, domain, true, true)
	c.Header("Set-Cookie", 
		cookieName+"="+jwtToken+
		"; Path="+path+
		"; Domain="+domain+
		"; Max-Age="+fmt.Sprint(maxAge)+
		"; Secure"+
		"; HttpOnly"+
		"; SameSite=None"+
		"; Partitioned",
	)
	
	c.JSON(statusCode, gin.H{"message": "Login Successful"})
	c.Redirect(http.StatusTemporaryRedirect, "https://maildrop.netlify.app/dashboard/home")
}

func (usrHdl *UserHandler) VerifyOTP(c *gin.Context) {
	otpCodeStr := c.Query("code")
	if otpCodeStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "OTP Code is missing"})
		return
	}

	otpCode, err := strconv.Atoi(otpCodeStr)
	if err != nil {
		c.JSON(500, gin.H{"error": "Internal server error: atoi"})
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