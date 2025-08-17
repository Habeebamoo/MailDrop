package models

import (
	"time"

	"github.com/google/uuid"
)

type Activity struct {
	Id         uint       `json:"-"           gorm:"autoIncrement"`
	UserId     uuid.UUID  `json:"userId"      gorm:"primaryKey"`
	Name       string     `json:"name"`
	Type       string     `json:"type"`
	CreatedAt  time.Time  `json:"createdAt"`
}