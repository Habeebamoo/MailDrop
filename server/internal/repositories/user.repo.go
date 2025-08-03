package repositories

import (
	"fmt"
	"net/http"

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
		if err == gorm.ErrDuplicatedKey {
			return http.StatusBadRequest, fmt.Errorf("user already exist")
		}
		return 500, fmt.Errorf("internal server error")
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