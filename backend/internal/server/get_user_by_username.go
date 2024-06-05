package server

import (
	"errors"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
	"net/http"
	"time"
)

type getUserResponse struct {
	ID          string   `json:"id"`
	Username    string   `json:"username"`
	Location    string   `json:"location"`
	Bio         string   `json:"bio"`
	Goals       []string `json:"goals"`
	MemberSince string   `json:"member_since"`
}

func (s *Server) getUserByUsername(c *gin.Context) {
	username := c.Param("username")
	if username == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "missing username",
		})
		return
	}
	user, err := s.getUserFromUsername(c, username)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			c.JSON(http.StatusNotFound, gin.H{
				"error": "username not found",
			})

		} else {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": err.Error(),
			})

		}
		return
	}
	c.JSON(http.StatusOK, getUserResponse{
		ID:          user.ID.Hex(),
		Username:    user.Username,
		Location:    user.Location,
		Bio:         user.Bio,
		Goals:       user.Goals,
		MemberSince: time.Unix(int64(user.MemberSince)/1000, (int64(user.MemberSince)%1000)*1000000).Format("2006-01-02"),
	})
}
