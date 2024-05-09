package server

import (
	"errors"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"net/http"
)

type registerUserRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func (s *Server) registerUser(c *gin.Context) {
	var req registerUserRequest

	if err := c.ShouldBind(&req); err != nil {
		c.JSON(
			http.StatusBadRequest,
			gin.H{"error": err.Error()},
		)
		return
	}

	user, err := s.createUser(c, req.Username, req.Password)
	if err != nil {
		if errors.Is(err, ErrExistingUser) {
			c.JSON(http.StatusConflict, gin.H{"error": ErrExistingUser.Error()})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	var auth string
	if auth, err = s.createAuthTokenForUser(c, req.Username); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": fmt.Sprintf("couldn't create authToken: %v", err),
		})
		return
	}
	setAuthCookie(c, auth)
	c.JSON(http.StatusOK, gin.H{"username": user.Username})
}

func (s *Server) createAuthTokenForUser(c *gin.Context, username string) (string, error) {
	auth := uuid.New().String()
	_, err := s.db.Collection(authCollectionName).InsertOne(c, AuthModel{Username: username, Auth: auth})
	if err != nil {
		return "", err
	}
	return auth, nil
}

func setAuthCookie(c *gin.Context, token string) {
	c.SetCookie(authCookieName, token, 3600, "/", "", false, true)
}
