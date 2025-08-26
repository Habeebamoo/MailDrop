package routes

import (
	"time"

	"github.com/Habeebamoo/MailDrop/server/internal/handlers"
	"github.com/Habeebamoo/MailDrop/server/internal/middlewares"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func ConfigureRoutes(userHandler handlers.UserHandler, campaignHandler handlers.CampaignHandler) *gin.Engine {
	router := gin.Default()

	//middlewares
	router.Use(cors.New(cors.Config{
		AllowOrigins: []string{"https://maildrop.netlify.app"},
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders: []string{"Origin", "Content-Type", "X-API-KEY"},
		ExposeHeaders: []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge: 12 * time.Hour,
	}))

	router.Use(middlewares.RequireAPIKey())
	router.Use(middlewares.RateLimiter())

	api := router.Group("/api")
	api.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "All systems are working fine"})
	})

	//auth routes
	auth := api.Group("/auth")
	{
		auth.POST("/register", userHandler.Register)
		auth.POST("/login", userHandler.Login)
		auth.POST("/forgot-password", userHandler.ForgotPassword)
		auth.POST("/reset-password", userHandler.ResetPassword)
	}

	//new subscriber routes
	subscriber := api.Group("/subscriber")
	{
		subscriber.GET("/campaign/:id", campaignHandler.GetCampaign)
		subscriber.POST("", campaignHandler.CreateSubscriber)
		subscriber.POST("/:id/click", campaignHandler.CampaignClick)
	}

	//user routes
	user := api.Group("/user", middlewares.AuthenticateUser())
	{
		user.GET("/me", userHandler.GetUser)
		user.GET("/activities", userHandler.GetActivities)
		user.POST("/profile", userHandler.UpdateProfile)
		user.POST("/logout", userHandler.Logout)
	}
	
	//campaign routes
	campaign := api.Group("/campaign", middlewares.AuthenticateUser())
	{
		campaign.POST("", campaignHandler.CreateCampaign)
		campaign.GET("", campaignHandler.GetAllCampaigns)
		campaign.GET("/:id", campaignHandler.GetCampaign)
		campaign.GET("/:id/subscribers", campaignHandler.GetSubscribers)
		campaign.GET("/:id/subscribers/download", campaignHandler.DownloadSubscribers)
		campaign.DELETE("/:id", campaignHandler.DeleteCampaign)
	}

	return router
}