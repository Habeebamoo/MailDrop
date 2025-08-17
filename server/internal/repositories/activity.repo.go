package repositories

import (
	"fmt"

	"github.com/Habeebamoo/MailDrop/server/internal/models"
	"gorm.io/gorm"
)

type ActivityRepository interface {
	CreateActivity(models.Activity) error
}

type ActivityRepo struct {
	db *gorm.DB
}

func NewActivityRepository(db *gorm.DB) ActivityRepository {
	return &ActivityRepo{db: db}
}

func (activityRepo *ActivityRepo) CreateActivity(activity models.Activity) error {
	err := activityRepo.db.Create(&activity).Error
	if err != nil {
		return fmt.Errorf("failed to create recent activity")
	}

	return nil
}