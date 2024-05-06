package server

import (
	"errors"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"net/http"
)

type getRunRequest struct{}
type getRunResponse struct {
	Date     primitive.DateTime
	Distance float64
	Duration int64
	RunType  string
	Notes    string
	Username string
	Location string
	Title    string
}

func (s *Server) getRunById(c *gin.Context) {
	ID := c.Param("id")
	if ID == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "missing ID",
		})
		return
	}
	objID, err := primitive.ObjectIDFromHex(ID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	var resultRun run
	err = s.db.Collection(runsCollectionName).FindOne(c, bson.M{"_id": objID}).Decode(&resultRun)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			c.JSON(http.StatusNotFound, gin.H{
				"error": "run with this ID not found",
			})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": err.Error(),
			})
		}
		return
	}
	c.JSON(http.StatusOK, getRunResponse{
		Date:     resultRun.Date,
		Distance: resultRun.Distance,
		Duration: resultRun.Duration,
		RunType:  resultRun.RunType,
		Notes:    resultRun.Notes,
		Username: resultRun.Username,
		Location: resultRun.Location,
		Title:    resultRun.Title,
	})
	return
}
