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
	LeadMagnet     bool       `json:"leadMagnet"`
	LeadMagnetUrl  string     `json:"leadMagnetUrl"`
	Slug           string     `json:"slug"`
	CreatedAt      time.Time  `json:"createdAt"     gorm:"default:now"`
}

type CampaignRequest struct {
	UserId         string  `json:"userId"         binding:"required"`
	Title          string  `json:"title"          binding:"required"`
	Description    string  `json:"description"    binding:"required"`
	LeadMagnet     bool    `json:"leadMagnet"     binding:"required"`
	LeadMagnetUrl  string  `json:"leadMagnetUrl"  binding:"required"`
}