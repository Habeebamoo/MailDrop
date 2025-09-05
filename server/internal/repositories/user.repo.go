package repositories

import (
	"crypto/rand"
	"fmt"
	"math/big"
	"net/http"
	"strings"
	"time"

	"github.com/Habeebamoo/MailDrop/server/internal/models"
	"github.com/Habeebamoo/MailDrop/server/internal/utils"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type UserRepository interface {
	InsertUser(*models.User, string) (int, error)
	Exists(string) bool
	GetUser(string) (models.User, int, error)
	GetUserById(uuid.UUID) (models.User, int, error)
	GetUserIdByOTP(int) (uuid.UUID, int, error)
	GetActivities(uuid.UUID) ([]models.ActivityResponse, int ,error)
	UpdateProfile(models.ProfileDetailsRequest) (int, error)
	CreateToken(uuid.UUID, string) (int, error)
	GetUserIdByToken(string) (models.Token, int, error)
	DeleteToken(uuid.UUID) (int, error)
	CreateOTP(uuid.UUID) (int, error)
	DeleteOTP(uuid.UUID) (int, error)
	UpdatePassword(uuid.UUID, string) (int, error)
	VerifyEmail(uuid.UUID) (int, error)
}

type UserRepo struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {
	return &UserRepo{db: db}
}

func (userRepo *UserRepo) InsertUser(user *models.User, pic string) (int, error) {
	//create the user
	err := userRepo.db.Create(user).Error
	if err != nil {
		if strings.Contains(err.Error(), "duplicate key value") {
			return http.StatusNotAcceptable, fmt.Errorf("user already exist")
		}
		return 500, fmt.Errorf("internal server error")
	}

	//get created user
	var createdUser models.User
	err = userRepo.db.First(&createdUser, "email = ?", user.Email).Error
	if err != nil {
		return 500, fmt.Errorf("failed to get user")
	}

	//assign user profile
	userProfile := models.Profile{
		UserId: createdUser.UserId,
		ProfilePic: pic,
		Bio: "Campaign Admin",
		TotalCampaigns: 0,
		TotalSubscribers: 0,
		TotalClicks: 0,
		TotalEmails: 0,
	}

	//create user profile
	err = userRepo.db.Create(&userProfile).Error
	if err != nil {
		return 500, fmt.Errorf("failed to create user profile")
	}

	//create activity
	activity := models.Activity{
		UserId: createdUser.UserId,
		Name: "Signed up on MailDrop",
		Type: "profile",
		CreatedAt: time.Now(),
	}

	err = userRepo.db.Create(&activity).Error
	if err != nil {
		return 500, fmt.Errorf("failed to create user activity")
	}

	return 201, nil
}

func (userRepo *UserRepo) Exists(email string) bool {
	var user models.User
	res := userRepo.db.First(&user, "email = ?", email)
	if res.Error == gorm.ErrRecordNotFound {
		return false
	} else {
		return true
	}
}

func (userRepo *UserRepo) GetUser(email string) (models.User, int, error) {
	var user models.User
	err := userRepo.db.First(&user, "email = ?", email).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return models.User{}, http.StatusNotFound, fmt.Errorf("user does not exists")
		}
		return models.User{} ,500, fmt.Errorf("internal server error")
	}
	return user, 200, nil
}

func (userRepo *UserRepo) GetUserById(userId uuid.UUID) (models.User, int, error) {
	var user models.User
	err := userRepo.db.Preload("Profile").First(&user, "user_id = ?", userId).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return models.User{}, http.StatusNotFound, fmt.Errorf("user does not exists")
		}
		return models.User{} ,500, fmt.Errorf("internal server error")
	}
	return user, 200, nil
}

func (userRepo *UserRepo) GetUserIdByOTP(otpCode int) (uuid.UUID, int, error) {
	var userOtp models.OTP
	err := userRepo.db.First(&userOtp, "code = ?", otpCode).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return uuid.UUID{}, http.StatusUnauthorized, fmt.Errorf("invalid OTP code")
		}
		return uuid.UUID{}, 500, fmt.Errorf("internal server error")
	}

	return userOtp.UserId, 200, nil
}

func (userRepo *UserRepo) GetActivities(userId uuid.UUID) ([]models.ActivityResponse, int, error) {
	var userActivities []models.Activity
	err := userRepo.db.Find(&userActivities, "user_id = ?", userId).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return []models.ActivityResponse{}, 404, fmt.Errorf("user don't have any activies")
		}
		return []models.ActivityResponse{}, 500, fmt.Errorf("internal server error")
	}

	response := make([]models.ActivityResponse, len(userActivities))
	
	for i, activity := range userActivities {
		response[i] = models.ActivityResponse{
			UserId: activity.UserId,
			Name: activity.Name,
			Type: activity.Type,
			CreatedAt: utils.GetTimeAgo(activity.CreatedAt),
		}
	}

	return response, 200, nil
}

func (userRepo *UserRepo) UpdateProfile(profileReq models.ProfileDetailsRequest) (int, error) {
	res := userRepo.db.Model(&models.Profile{}).Where("user_id = ?", profileReq.UserId).Updates(profileReq)
	if res.Error != nil {
		return 500, res.Error
	}
	return 200, nil
}

func (userRepo *UserRepo) CreateOTP(userId uuid.UUID) (int, error) {
	//delete all existing OTP's created by the user
	err := userRepo.db.Where("user_id = ?", userId).Delete(&models.OTP{}).Error
	if err != nil {
		return 0, fmt.Errorf("internal server error")
	}

	//create OTP for verification
	n, err := rand.Int(rand.Reader, big.NewInt(900000))
	if err != nil {
		return 0, fmt.Errorf("internal server error")
	}

	otpCode := int(100000 + n.Int64())

	otp := models.OTP{
		UserId: userId,
		Code: otpCode,
		ExpiresAt: time.Now().Add(10*time.Minute),
	}

	err = userRepo.db.Create(&otp).Error
	if err != nil {
		return 0, fmt.Errorf("internal server error")
	}

	return otp.Code, nil
}

func (userRepo *UserRepo) DeleteOTP(userId uuid.UUID) (int, error) {
	err := userRepo.db.Where("user_id = ?", userId).Delete(&models.OTP{}).Error
	if err != nil {
		return 0, fmt.Errorf("internal server error")
	}
	return 200, nil
}

func (userRepo *UserRepo) CreateToken(userId uuid.UUID, generatedToken string) (int, error) {
	//delete all existing tokens created by the user
	err := userRepo.db.Where("user_id = ?", userId).Delete(&models.Token{}).Error
	if err != nil {
		return 500, fmt.Errorf("internal server error")
	}

	//create a token for verification
	token := models.Token{
		UserId: userId,
		Token: generatedToken,
		ExpiresAt: time.Now().Add(12 * time.Hour),
	}

	err = userRepo.db.Create(&token).Error
	if err != nil {
		return 500, fmt.Errorf("internal server error")
	}
	
	return 200, nil
}

func (userRepo *UserRepo) GetUserIdByToken(token string) (models.Token, int, error) {
	//get token
	var userToken models.Token
	err := userRepo.db.First(&userToken, "token = ?", token).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return models.Token{}, http.StatusUnauthorized, fmt.Errorf("invalid token")
		}
		return models.Token{}, 500, fmt.Errorf("internal server error")
	}

	return userToken, 200, nil
}

func (userRepo *UserRepo) DeleteToken(userId uuid.UUID) (int, error) {
	err := userRepo.db.Where("user_id = ?", userId).Delete(&models.Token{}).Error
	if err != nil {
		return 500, fmt.Errorf("internal server error")
	}

	return 200, nil
}

func (userRepo *UserRepo) UpdatePassword(userId uuid.UUID, newHashedPassword string) (int, error) {
	err := userRepo.db.Model(&models.User{}).
							Where("user_id = ?", userId).
							Update("password", newHashedPassword).
							Error

	if err != nil {
		return 500, fmt.Errorf("failed to update password")
	}

	return 200, nil
}

func (userRepo *UserRepo) VerifyEmail(userId uuid.UUID) (int, error) {
	err := userRepo.db.Model(&models.User{}).
							Where("user_id = ?", userId).
							Update("verified", true).
							Error

	if err != nil {
		return 500, fmt.Errorf("failed to verify user")
	}

	return 200, nil
}