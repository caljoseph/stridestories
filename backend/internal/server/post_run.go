package server

import (
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"net/http"
)

type postRunRequest struct {
	Date     primitive.DateTime `json:"date" binding:"required"`
	Distance float64            `json:"distance" binding:"required"`
	Duration int64              `json:"duration" binding:"required"`
	RunType  string             `json:"runType" binding:"required"`
	Notes    string             `json:"notes" binding:"required"`
	Location string             `json:"location" binding:"required"`
	Title    string             `json:"title" binding:"required"`
}

func (s *Server) postRun(c *gin.Context) {
	// Extract run info and store in db model
	var req postRunRequest
	err := c.ShouldBind(&req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	// Validate RunType
	switch req.RunType {
	case "Jog", "Trail", "Interval", "Race":
		// valid
	default:
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid run type provided",
		})
		return
	}

	// force to use the username associated with cookie, ie logged in user
	username, exists := c.Get("username")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Username not found in the request context",
		})
		return
	}

	r := &run{
		ID:       primitive.NewObjectID(),
		Date:     req.Date,
		Distance: req.Distance,
		Duration: req.Duration,
		RunType:  req.RunType,
		Notes:    req.Notes,
		Username: username.(string),
		Location: req.Location,
		Title:    req.Title,
	}

	// Insert to runs
	_, err = s.db.Collection(runsCollectionName).InsertOne(c, r)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"ID": r.ID.Hex(),
	})
	return
}
