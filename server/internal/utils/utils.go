package utils

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"mime/multipart"
	"os"
	"regexp"
	"time"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"golang.org/x/text/cases"
	"golang.org/x/text/language"
)

func HashPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(hashedPassword), err
}

func VerifyPassword(hashedPassword, password string) error {
	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
}

func GenerateJWT(userId uuid.UUID) (string, error) {
	claims := jwt.MapClaims{
		"userId": userId.String(),
		"exp": time.Now().Add(24*time.Hour).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(os.Getenv("JWT_KEY")))
}

func IsValidEmail(email string) bool {
	re := regexp.MustCompile(`^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z{2,}$]`)
	return re.MatchString(email)
}

func GetTimeAgo(t time.Time) string {
	duration := time.Since(t)

	switch {
	case duration < time.Minute:
		return "just now"
	case duration < time.Hour:
		return fmt.Sprintf("%d mins ago", int(duration.Minutes()))
	case duration < 24*time.Hour:
		return fmt.Sprintf("%d hours ago", int(duration.Hours()))
	case duration < 30*24*time.Hour:
		return fmt.Sprintf("%d days ago", int(duration.Hours()/24))
	case duration < 12*30*24*time.Hour:
		return fmt.Sprintf("%d months ago", int(duration.Hours()/(24*30)))
	default:
		return fmt.Sprintf("%d years ago", int(duration.Hours()/(24*365)))
	}
}

func Capitalize(str string, every bool) string {
	caser := cases.Title(language.English)

	if every {
		return caser.String(str)
	}

	firstChar := str[:1]
	restChars := str[1:]

	return caser.String(firstChar) + restChars
}

func GetRandomString() (string, error) {
	b := make([]byte, 16)
	_, err := rand.Read(b)
	if err != nil {
		return "", fmt.Errorf("failed to read bytes")
	}
	
	return base64.URLEncoding.EncodeToString(b), nil
}

func GenerateElasticWorker(amountOfJobs int) int {
	if amountOfJobs < 3 {
		return 1
	} else if amountOfJobs < 10 {
		return 2
	} else if amountOfJobs < 50 {
		return 5
	} else if amountOfJobs < 200 {
		return 10
	} else if amountOfJobs < 1000 {
		return 50
	} else if amountOfJobs < 10000 {
		return 200
	} else {
		return 500
	}
}

func UploadPic(file multipart.File) (string, error) {
	cld, err := cloudinary.NewFromParams(
		os.Getenv("CLD_CLOUD_NAME"),
		os.Getenv("CLD_API_KEY"),
		os.Getenv("CLD_API_SECRET"),
	)
	if err != nil {
		return "", fmt.Errorf("failed to connect to storage")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	uploadRes, err := cld.Upload.Upload(ctx, file, uploader.UploadParams{
		Folder: "profile_pics",
	})
	if err != nil {
		return "", fmt.Errorf("upload error")
	}

	image, err := cld.Image(uploadRes.PublicID)
	if err != nil {
		return "", fmt.Errorf("internal server error")
	}

	image.Transformation = "c_fill,h_150,w_150"
	imageUrl, err := image.String()
	if err != nil {
		return "", fmt.Errorf("internal server error")
	}

	return imageUrl, nil
}