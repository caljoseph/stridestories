package server

import (
	"errors"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"net/http"
)

type getUserResponse struct {
	ID          primitive.ObjectID
	Username    string
	Location    string
	Bio         string
	Goals       []string
	MemberSince primitive.DateTime
}

func (s *Server) getUserByUsername(c *gin.Context) {
	username := c.Param("username")
	if username == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "missing username",
		})
		return
	}
	user, err := s.GetUser(c, username)
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
		ID:          user.ID,
		Username:    user.Username,
		Location:    user.Location,
		Bio:         user.Bio,
		Goals:       user.Goals,
		MemberSince: user.MemberSince,
	})
}
