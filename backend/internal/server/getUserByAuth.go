package server

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func (s *Server) getUserByAuth(c *gin.Context) {
	usernameInterface, exists := c.Get("username")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Username not found in the request context",
		})
		return
	}
	username, ok := usernameInterface.(string)
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Username is not a valid string",
		})
		return
	}
	user, err := s.getUserFromUsername(c, username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
	}
	c.JSON(http.StatusOK, user)
	return
}
