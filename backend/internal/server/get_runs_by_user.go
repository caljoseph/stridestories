package server

import (
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
	"net/http"
)

type getRunsResponse struct {
	RunsList []run `json:"runsList"`
}

func (s *Server) getRunsByUser(c *gin.Context) {

	username := c.Param("username")
	month := c.Query("month")
	year := c.Query("year")

	if username == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "missing username",
		})
		return
	}

	// if date is specified then define filter and options
	var filter bson.M
	var opt *options.FindOptions
	var err error

	if month == "" || year == "" {
		filter, opt = bson.M{"username": username}, nil
	} else {
		filter, opt, err = getMonthFilterAndOptions(month, year)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}
		filter["username"] = username
	}

	cursor, err := s.db.Collection(runsCollectionName).Find(c, filter, opt)
	// note that it's not returning a list but a cursor which I need to iterate over to grab runs
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	var runs []run
	if err = cursor.All(c, &runs); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, getRunsResponse{
		RunsList: runs,
	})

}
