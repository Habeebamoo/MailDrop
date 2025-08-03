package models

type User struct {
	ID        int     `gorm:"primaryKey"`
	UserId    string  `json:"userId" gorm:"unique;type:uuid.UUID;default:uuid_generate_v4()"`
	Name      string  `json:"name"`
	Email     string  `json:"email" gorm:"unique"`
	Password  string  `json:"password"`
	Provider  string  `json:"provider"`
}

type UserRequest struct {
	Name      string  `json:"name" binding:"required"`
	Email     string  `json:"email" binding:"required,email"`
	Password  string  `json:"password" binding:"required,min=6"`
	Provider  string  `json:"provider"`
}

type UserLogin struct {
	Email     string  `json:"email" binding:"required"`
	Password  string  `json:"password" binding:"required"`
}