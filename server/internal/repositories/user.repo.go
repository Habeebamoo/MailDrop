package repositories

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/Habeebamoo/MailDrop/internal/models"
	"gorm.io/gorm"
)

type UserRepository interface {
	InsertUser(models.UserRequest) (int, error)
	Exists(string) bool
	GetUser(string) (models.User, int, error)
}

type UserRepo struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {
	return &UserRepo{db: db}
}

func (userRepo *UserRepo) InsertUser(user models.UserRequest) (int, error) {
	err := userRepo.db.Create(&user).Error
	if err != nil {
		if strings.Contains(err.Error(), "duplicate key value") {
			return http.StatusNotAcceptable, fmt.Errorf("user already exist")
		}
		return 500, fmt.Errorf("internal server error")
	}

	var createdUser models.User
	err = userRepo.db.First(&createdUser, "email = ?", user.Email).Error
	if err != nil {
		return 500, fmt.Errorf("failed to get user")
	}

	userProfile := models.Profile{
		UserId: createdUser.UserId,
		ProfilePic: "",
		Bio: "Campaign Admin",
		TotalCampaigns: 0,
		TotalSubscribers: 0,
		TotalClicks: 0,
		TotalEmails: 0,
	}

	err = userRepo.db.Create(&userProfile).Error
	if err != nil {
		return 500, fmt.Errorf("failed to create user profile")
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