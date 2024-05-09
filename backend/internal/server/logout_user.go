package server

import (
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"net/http"
)

func (s *Server) logoutUser(c *gin.Context) {
	// Retrieve the token from the cookie
	token, err := c.Cookie("authToken")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to retrieve token",
		})
		return
	}

	s.invalidateAuthToken(c, token)

	// For some reason the way that we delete cookies is by sending another with a negative max age
	c.SetCookie("authToken", "", -1, "/", "", false, true)
	c.JSON(http.StatusOK, gin.H{
		"message": "logout successful",
	})
}

func (s *Server) invalidateAuthToken(c *gin.Context, token string) {
	_, err := s.db.Collection(authCollectionName).DeleteOne(c, bson.M{"auth": token})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to invalidate token",
		})
		return
	}
}
