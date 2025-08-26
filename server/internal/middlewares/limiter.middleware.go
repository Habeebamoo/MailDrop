package middlewares

import (
	"net/http"
	"time"

	"github.com/JGLTechnologies/gin-rate-limit"
	"github.com/gin-gonic/gin"
)

func RateLimiter() gin.HandlerFunc {
	//im-memory store for tracking request
	store := ratelimit.InMemoryStore(&ratelimit.InMemoryOptions{
		Rate: time.Minute,
		Limit: 20,
	})

	//middleware
	return ratelimit.RateLimiter(store, &ratelimit.Options{
		ErrorHandler: func(c *gin.Context, info ratelimit.Info) {
			c.JSON(http.StatusTooManyRequests, gin.H{"error": "Too many request. Try again later"})
		},
		KeyFunc: func(c *gin.Context) string {
			return c.ClientIP()
		},
	})
}