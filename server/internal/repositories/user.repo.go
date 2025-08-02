package repositories

import "gorm.io/gorm"

type UserRepository interface {
	Testing()
}

type UserRepo struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {
	return &UserRepo{db: db}
}

func (userRepo *UserRepo) Testing() {
	
}