package routes

import (
	"github.com/Habeebamoo/MailDrop/server/internal/handlers"
	"github.com/Habeebamoo/MailDrop/server/internal/middlewares"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func ConfigureRoutes(userHandler handlers.UserHandler, campaignHandler handlers.CampaignHandler) *gin.Engine {
	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders: []string{"Origin", "Content-Type"},
		AllowCredentials: true,
	}))

	api := router.Group("/api")

	//auth routes
	auth := api.Group("/auth")
	{
		auth.POST("/register", userHandler.Register)
		auth.POST("/login", userHandler.Login)
	}

	//user routes
	user := api.Group("/user", middlewares.AuthenticateUser())
	{
		user.GET("/me", userHandler.GetUser)
	}
	
	//campaign routes
	api.POST("/campaign", middlewares.AuthenticateUser(), campaignHandler.CreateCampaign)
	api.GET("/campaign", middlewares.AuthenticateUser(), campaignHandler.GetAllCampaigns)
	api.GET("/campaign/:id", middlewares.AuthenticateUser(), campaignHandler.GetCampaign)
	api.DELETE("/campaign/:id", middlewares.AuthenticateUser(), campaignHandler.DeleteCampaign)

	return router
}