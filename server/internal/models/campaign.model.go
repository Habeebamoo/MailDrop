package models

import (
	"time"

	"github.com/google/uuid"
)

type Campaign struct {
	Id                uint       `json:"-"             gorm:"autoIncrement"`
	UserId            uuid.UUID  `json:"userId"`
	UserName          string     `json:"username"`
	UserBio           string     `json:"userbio"`
	UserPicture       string     `json:"userPicture"`
	CampaignId        uuid.UUID  `json:"campaignId"    gorm:"primaryKey;unique;type:uuid;default:uuid_generate_v4()"`
	Title             string     `json:"title"         gorm:"unique"`
	Description       string     `json:"description"`
	LeadMagnetName    string     `json:"leadMagnetName"`
	LeadMagnetUrl     string     `json:"leadMagnetUrl"`
	Slug              string     `json:"slug"`
	Active            bool       `json:"active"`
	TotalSubscribers  int        `json:"totalSubscribers"`
	TotalClicks       int        `json:"totalClicks"`
	TotalEmails       int        `json:"totalEmails"`
	CreatedAt         time.Time  `json:"createdAt"`
}

type Subscriber struct {
	Id              uint       `json:"-"               gorm:"primaryKey;autoIncrement"`
	CampaignId      uuid.UUID  `json:"campaignId"`
	CampaignStatus  string     `json:"campaignStatus"`
	UserId          uuid.UUID  `json:"userId"`
	Name            string     `json:"name"`
	Email           string     `json:"email"`
	CreatedAt       time.Time  `json:"createdAt"`
}

type CampaignResponse struct {
	UserId            uuid.UUID  `json:"userId"`
	CampaignId        uuid.UUID  `json:"campaignId"`
	UserName          string     `json:"username"`
	UserBio           string     `json:"userbio"`
	UserPicture       string     `json:"userPicture"`
	Title             string     `json:"title"`
	Description       string     `json:"description"`
	LeadMagnetName    string     `json:"leadMagnetName"`
	LeadMagnetUrl     string     `json:"leadMagnetUrl"`
	Slug              string		 `json:"slug"`
	Active            bool       `json:"active"`
	TotalSubscribers  int        `json:"totalSubscribers"`
	TotalEmails       int        `json:"totalEmails"`
	TotalClicks       int        `json:"totalClicks"`
	CreatedAt         string     `json:"createdAt"`
}

type SubscriberCampaignResponse struct {
	UserId            uuid.UUID  `json:"userId"`
	CampaignId        uuid.UUID  `json:"campaignId"`
	UserName          string     `json:"username"`
	UserBio           string     `json:"userbio"`
	UserPicture       string     `json:"userPicture"`
	Title             string     `json:"title"`
	Description       string     `json:"description"`
	LeadMagnetName    string     `json:"leadMagnetName"`
	LeadMagnetUrl     string     `json:"leadMagnetUrl"`
}

type CampaignRequest struct {
	UserId          string  `json:"userId"         binding:"required"`
	UserName        string  `json:"username"       binding:"required"`
	UserBio         string  `json:"userbio"        binding:"required"`
	UserPicture     string  `json:"userPicture"`
	Title           string  `json:"title"          binding:"required"`
	Description     string  `json:"description"    binding:"required"`
	LeadMagnetName  string  `json:"leadMagnetName"`
	LeadMagnetUrl   string  `json:"leadMagnetUrl"`
}

type SubscriberRequest struct {
	CampaignId  string  `json:"campaignId"  binding:"required"`
	UserId      string  `json:"userId"      binding:"required"`
	Name        string  `json:"name"        binding:"required"`
	Email       string  `json:"email"       binding:"required,email"`
}

type SubscribersCsv struct {
	Name   string  `csv:"Name"`
	Email  string  `csv:"Email"`
}