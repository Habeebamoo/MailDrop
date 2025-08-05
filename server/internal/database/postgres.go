package database

import (
	"gorm.io/gorm"
	"gorm.io/driver/postgres"
)

func Initialize() (*gorm.DB, error) {
	dsn := "host=localhost port=5432 user=postgres password=habeeb1234 dbname=maildrop sslmode=disable"
	return gorm.Open(postgres.Open(dsn), &gorm.Config{})
}