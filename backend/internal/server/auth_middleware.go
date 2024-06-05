package server

import (
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"net/http"
)

const authCookieName = "authToken"

func (s *Server) authMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Retrieve the token from the cookie
		token, err := c.Cookie(authCookieName)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "No token provided"})
			c.Abort()
			return
		}

		// Validate the token
		var auth AuthModel
		if err := s.db.Collection(authCollectionName).FindOne(c, bson.M{"auth": token}).Decode(&auth); err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		// Store the username in the context, so we can use it later
		c.Set("username", auth.Username)
		c.Next()
	}
}
