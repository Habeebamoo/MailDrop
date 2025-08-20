package models

import (
	"time"

	"github.com/google/uuid"
)

type Campaign struct {
	Id             uint       `json:"-"             gorm:"autoIncrement"`
	UserId         uuid.UUID  `json:"userId"        gorm:"primaryKey"`
	CampaignId     uuid.UUID  `json:"campaignId"    gorm:"unique;type:uuid;default:uuid_generate_v4()"`
	Title          string     `json:"string"        gorm:"unique"`
	Description    string     `json:"description"`
	LeadMagnetUrl  string     `json:"leadMagnetUrl"`
	Slug           string     `json:"slug"`
	CreatedAt      time.Time  `json:"createdAt"`
}

type Subscriber struct {
	Id          uint       `json:"-"           gorm:"autoIncrement"`
	CampaignId  uuid.UUID  `json:"campaignId"  gorm:"primaryKey"`
	UserId      uuid.UUID  `json:"userId"`
	Name        string     `json:"name"`
	Email       string     `json:"email"`
}

type CampaignRequest struct {
	UserId         string  `json:"userId"         binding:"required"`
	Title          string  `json:"title"          binding:"required"`
	Description    string  `json:"description"    binding:"required"`
	LeadMagnetUrl  string  `json:"leadMagnetUrl"`
}

type SubscriberRequest struct {
	CampaignId  uuid.UUID  `json:"campaignId"  binding:"required"`
	UserId      uuid.UUID  `json:"userId"      binding:"required"`
	Name        string     `json:"name"        binding:"required"`
	Email       string     `json:"email"       binding:"required,email"`
}