package models

import (
	"github.com/google/uuid"
)

type User struct {
	UserId    uuid.UUID   `json:"userId"    gorm:"unique;type:uuid;default:uuid_generate_v4()"`
	Name      string      `json:"name"`
	Email     string      `json:"email"     gorm:"unique"`
	Password  string      `json:"password"`
	AuthType  string      `json:"authType"`
	Profile   Profile     `json:"profile"   gorm:"primaryKey:UserId;references:UserId"`
}

type Profile struct {
	UserId            uuid.UUID  `json:"userId"`
	ProfilePic        string     `json:"profilePic"`
	Bio 			        string     `json:"bio"`
	TotalCampaigns    int        `json:"totalCampaigns"`
	TotalSubscribers  int		     `json:"totalSubscribers"`
	TotalClicks       int        `json:"totalClicks"`
	TotalEmails       int		     `json:"totalEmails"`
}

type UserRequest struct {
	Name      string  `json:"name"      binding:"required"`
	Email     string  `json:"email"     binding:"required,email"`
	Password  string  `json:"password"  binding:"required,min=6"`
	AuthType  string  `json:"authType"`
}

type UserLogin struct {
	Email     string  `json:"email"     binding:"required"`
	Password  string  `json:"password"  binding:"required"`
}
