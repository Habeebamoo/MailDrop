package database

import (
	"gorm.io/gorm"
	"gorm.io/driver/postgres"
)

func Initialize() (*gorm.DB, error) {
	dsn := ""
	return gorm.Open(postgres.Open(dsn), &gorm.Config{})
}