package models

import (
	"fmt"
	"mime/multipart"
	"time"

	"github.com/google/uuid"
)

type User struct {
	UserId     uuid.UUID  `json:"userId"     gorm:"primaryKey;unique;type:uuid;default:uuid_generate_v4()"`
	Name       string     `json:"name"`
	Email      string     `json:"email"      gorm:"unique"`
	Password   string     `json:"password"`
	Verified   bool       `json:"verified"`
	Profile    Profile    `json:"profile"    gorm:"primaryKey:UserId;references:UserId"`
	CreatedAt  time.Time  `json:"createdAt"`
}

type Profile struct {
	UserId            uuid.UUID  `json:"userId"           gorm:"type:uuid;primaryKey"`
	ProfilePic        string     `json:"profilePic"`
	Bio 			        string     `json:"bio"`
	TotalCampaigns    int        `json:"totalCampaigns"`
	TotalSubscribers  int		     `json:"totalSubscribers"`
	TotalClicks       int        `json:"totalClicks"`
	TotalEmails       int		     `json:"totalEmails"`
}

type Token struct {
	UserId     uuid.UUID  `json:"userId"     gorm:"primaryKey"`
	Token      string     `json:"token"`
	ExpiresAt  time.Time  `json:"expiresAt"`
}

type OTP struct {
	UserId     uuid.UUID  `json:"userId"     gorm:"primaryKey"`
	Code       int        `json:"code"`
	ExpiresAt  time.Time  `json:"expiresAt"`
}

type UserRequest struct {
	Name      string  `json:"name"`
	Email     string  `json:"email"`
	Password  string  `json:"password"`
}

type GoogleLoginRequest struct {
	Email    string  `json:"email"`
	Name     string  `json:"name"`
	Picture  string  `json:"picture"`
}

type UserLogin struct {
	Email     string  `json:"email"`
	Password  string  `json:"password"`
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
	Email  string  `json:"email"`
}

type ResetPasswordRequest struct {
	Token     string  `json:"token"`
	Password  string  `json:"password"`
}

func (u *UserRequest) ValidateUserRequest() error {
	if u.Name == "" {
		return fmt.Errorf("missing field: name")
	} else if u.Email == "" {
		return fmt.Errorf("missing field: email")
	} else if len(u.Password) < 6 {
		return fmt.Errorf("password must be 6 characters or more")
	}
	return nil
}

func (u *UserLogin) ValidateLoginRequest() error {
	if u.Email == "" {
		return fmt.Errorf("missing field: email")
	} else if u.Password == "" {
		return fmt.Errorf("missing field: password")
	}
	return nil
}

func (u *ForgotPasswordRequest) ValidateRequest() error {
	if u.Email == "" {
		return fmt.Errorf("missing field: email")
	}
	return nil
}

func (u *ResetPasswordRequest) ValidateRequest() error {
	if u.Token == "" {
		return fmt.Errorf("verification token missing")
	} else if len(u.Password) < 6 {
		return fmt.Errorf("password must be 6 characters or more")
	}
	return nil
}