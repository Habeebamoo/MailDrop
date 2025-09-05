package models

import (
	"fmt"
	"time"

	"github.com/google/uuid"
)

type Campaign struct {
	UserId            uuid.UUID  `json:"userId"`
	CampaignId        uuid.UUID  `json:"campaignId"    gorm:"primaryKey;unique;type:uuid;default:uuid_generate_v4()"`
	Title             string     `json:"title"`
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
	SubscriberId    uuid.UUID  `json:"-"               gorm:"primaryKey;unique;type:uuid;default:uuid_generate_v4()"`
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
	UserId          string  `json:"userId"`
	Title           string  `json:"title"`
	Description     string  `json:"description"`
	LeadMagnetName  string  `json:"leadMagnetName"`
	LeadMagnetUrl   string  `json:"leadMagnetUrl"`
}

type SubscriberRequest struct {
	CampaignId  string  `json:"campaignId"`
	UserId      string  `json:"userId"`
	Name        string  `json:"name"`
	Email       string  `json:"email"`
}

type SubscriberVerifyRequest struct {
	CampaignId  string  `json:"campaignId"`
	Email       string  `json:"email"`
}

type DeleteSubscriberRequest struct {
	Reason   string  `json:"reason"`
	Comment  string  `json:"comment"`
}

type EmailRequest struct {
	UserId      string  `json:"userId"      binding:"required"`
	CampaignId  string  `json:"campaignId"  binding:"required"`
	Subject     string  `json:"subject"     binding:"required"`
	SenderName  string  `json:"senderName"`
	Content     string  `json:"content"     binding:"required"`
}

type SubscribersCsv struct {
	Name   string  `csv:"Name"`
	Email  string  `csv:"Email"`
}

func (c *CampaignRequest) ValidateCampaignRequest() error {
	if c.UserId == "" {
		return fmt.Errorf("missing field: userId")
	} else if c.Title == "" {
		return fmt.Errorf("missing field: campaign title")
	} else if c.Description == "" {
		return fmt.Errorf("missing field: campaign description")
	}
	return nil
}

func (s *SubscriberRequest) ValidateSubscriberRequest() error {
	if s.CampaignId == "" {
		return fmt.Errorf("invalid campaign id")
	} else if s.UserId == "" {
		return fmt.Errorf("invalid creator id")
	} else if s.Name == "" {
		return fmt.Errorf("missing field: name")
	} else if s.Email == "" {
		return fmt.Errorf("missing field: email")
	}
	return nil
}

func (s *SubscriberVerifyRequest) ValidateVerificationRequest() error {
	if s.Email == "" {
		return fmt.Errorf("missing field: email")
	}
	return nil
}

func (e *EmailRequest) ValidateEmailRequest() error {
	if e.UserId == "" {
		return fmt.Errorf("missing field: userId")
	} else if e.CampaignId == "" {
		return fmt.Errorf("missing field: campaignId")
	} else if e.Subject == "" {
		return fmt.Errorf("missing field: Email Subject")
	} else if e.Content == "" {
		return fmt.Errorf("missing field: Email Body")
	}
	return nil
}