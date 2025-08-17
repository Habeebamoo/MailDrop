package service

import (
	"github.com/Habeebamoo/MailDrop/server/internal/models"
	"github.com/Habeebamoo/MailDrop/server/internal/repositories"
)

type ActivityService interface {
	CreateActivity(models.Activity) error
}

type ActivitySvc struct {
	repo repositories.ActivityRepository
}

func NewActivityService(repo repositories.ActivityRepository) ActivityService {
	return &ActivitySvc{repo: repo}
}

func (activitySvc *ActivitySvc) CreateActivity(activity models.Activity) error {
	return activitySvc.repo.CreateActivity(activity)
}