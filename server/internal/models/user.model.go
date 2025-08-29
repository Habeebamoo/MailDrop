package models

import (
	"mime/multipart"
	"time"

	"github.com/google/uuid"
)

type User struct {
	Id         uint       `json:"-"          gorm:"autoIncrement"`
	UserId     uuid.UUID  `json:"userId"     gorm:"primaryKey;unique;type:uuid;default:uuid_generate_v4()"`
	Name       string     `json:"name"`
	Email      string     `json:"email"      gorm:"unique"`
	Password   string     `json:"password"`
	Verified   bool       `json:"verified"`
	Profile    Profile    `json:"profile"    gorm:"primaryKey:UserId;references:UserId"`
	CreatedAt  time.Time  `json:"createdAt"`
}

type Profile struct {
	Id                uint       `json:"-"                gorm:"autoIncrement"`
	UserId            uuid.UUID  `json:"userId"           gorm:"type:uuid;primaryKey"`
	ProfilePic        string     `json:"profilePic"`
	Bio 			        string     `json:"bio"`
	TotalCampaigns    int        `json:"totalCampaigns"`
	TotalSubscribers  int		     `json:"totalSubscribers"`
	TotalClicks       int        `json:"totalClicks"`
	TotalEmails       int		     `json:"totalEmails"`
}

type Token struct {
	Id         uint       `json:"-"          gorm:"autoIncrement"`
	UserId     uuid.UUID  `json:"userId"`
	Token      uuid.UUID  `json:"token"      gorm:"primaryKey;type:uuid;default:uuid_generate_v4()"`
	ExpiresAt  time.Time  `json:"expiresAt"`
}

type OTP struct {
	UserId     uuid.UUID  `json:"userId"     gorm:"primaryKey"`
	Code       int        `json:"code"`
	ExpiresAt  time.Time  `json:"expiresAt"`
}

type UserRequest struct {
	Name      string  `json:"name"      binding:"required"`
	Email     string  `json:"email"     binding:"required,email"`
	Password  string  `json:"password"  binding:"required,min=6"`
}

type GoogleLoginRequest struct {
	Email          string  `json:"email"`
	GivenName      string  `json:"given_name"`
	FamilyName     string  `json:"family_name"`
	Id             string  `json:"id"`
	Name           string  `json:"name"`
	Picture        string  `json:"picture"`
	VerifiedEmail  bool    `json:"verified_email"`
}

type UserLogin struct {
	Email     string  `json:"email"     binding:"required"`
	Password  string  `json:"password"  binding:"required"`
}

type ProfileRequest struct {
	UserId  uuid.UUID
	Name    string
	Email   string
	Bio     string
	Image  	*multipart.FileHeader
}

type ProfileDetailsRequest struct {
	UserId  uuid.UUID
	Name    string
	Email   string
	Bio     string
	Image 	string
}

type ForgotPasswordRequest struct {
	Email  string  `json:"email"  binding:"required,email"`
}

type ResetPasswordRequest struct {
	Token     string  `json:"token"     binding:"required"`
	Password  string  `json:"password"  binding:"required,min=6"`
}
