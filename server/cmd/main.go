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
)

func main() {
	godotenv.Load()

	db, err := database.Initialize()
	if err != nil {
		log.Fatal(err)
	}

	//migrate struct to database tables
	db.AutoMigrate(&models.User{}, &models.Profile{}, &models.Campaign{}, &models.Activity{}, &models.Subscriber{})

	//repositories
	userRepo := repositories.NewUserRepository(db)
	campaignRepo := repositories.NewCampaignRepository(db)

	//services
	userService := service.NewUserService(userRepo)
	campaignService := service.NewCampaignService(campaignRepo)

	//handlers
	userHandler := handlers.NewUserHandler(userService)
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