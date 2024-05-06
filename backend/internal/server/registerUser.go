package server

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"net/http"
)

type createUserRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func (s *Server) registerUser(c *gin.Context) {
	var req createUserRequest

	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := s.CreateUser(c, req.Username, req.Password)
	if err != nil {
		if err.Error() == fmt.Sprintf("username %s already exists", req.Username) {
			c.JSON(http.StatusConflict, gin.H{"msg": "Existing user"})
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
	c.JSON(http.StatusOK, gin.H{"id": user.ID})
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
	c.SetCookie("authToken", token, 3600, "/", "", false, true)
}
