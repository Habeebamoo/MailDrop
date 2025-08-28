package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/Habeebamoo/MailDrop/server/internal/database"
	"github.com/Habeebamoo/MailDrop/server/internal/handlers"
	"github.com/Habeebamoo/MailDrop/server/internal/models"
	"github.com/Habeebamoo/MailDrop/server/internal/repositories"
	"github.com/Habeebamoo/MailDrop/server/internal/routes"
	"github.com/Habeebamoo/MailDrop/server/internal/service"
	"github.com/joho/godotenv"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

func main() {
	godotenv.Load()

	db, err := database.Initialize()
	if err != nil {
		log.Fatal(err)
	}

	//Restrict connections for PgBouncer session pooling
	sqlDB, _ := db.DB()
	sqlDB.SetMaxOpenConns(1)
	sqlDB.SetMaxIdleConns(1)

	//migrate struct to database tables
	db.AutoMigrate(
		&models.User{}, 
		&models.Profile{}, 
		&models.Campaign{}, 
		&models.Activity{}, 
		&models.Subscriber{},
		&models.Token{},
		&models.OTP{},
	)

	//Oauth config for google login
	googleOauth2Config := &oauth2.Config{
		ClientID: os.Getenv("GOOGLE_CLIENT_ID"),
		ClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
		RedirectURL: "https://maildrop-znoo.onrender.com/api/auth/google/callback",
		Scopes: []string{"https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"},
		Endpoint: google.Endpoint,
	}

	//repositories
	userRepo := repositories.NewUserRepository(db)
	campaignRepo := repositories.NewCampaignRepository(db)

	//services
	userService := service.NewUserService(userRepo)
	campaignService := service.NewCampaignService(campaignRepo)

	//handlers
	userHandler := handlers.NewUserHandler(userService,googleOauth2Config)
	campaignHandler := handlers.NewCampaignHandler(campaignService)

	router := routes.ConfigureRoutes(
		userHandler, 
		campaignHandler,
	)

	PORT := os.Getenv("PORT")
	if PORT == "" {
		PORT = "8080"
	}

	srv := &http.Server{
		Addr: ":"+PORT,
		Handler: router,
		ReadTimeout: 5*time.Second,
		WriteTimeout: 10*time.Second,
		IdleTimeout: 15*time.Second,
	}

	log.Println("Server Running on Port ", PORT)

	go func() {
		if err := srv.ListenAndServe(); err != nil && err == http.ErrServerClosed {
			log.Fatal("Server error ", err)
		}
	}()

	//Graceful shutdown
	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt, syscall.SIGTERM)
	<-c

	log.Println("Shutting down server")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatal("Server Failed to shutdown ", err)
	}

	log.Println("Server exiting cleanly")
}