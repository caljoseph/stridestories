package server

import (
	"errors"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
	"net/http"
	"strconv"
	"time"
)

var ErrInvalidDateParameters = errors.New("invalid date parameters")

type getLeaderboardResponse struct {
	RunsList []leaderBoardRun `json:"runsList"`
}

func (s *Server) getLongestRunsByMonth(c *gin.Context) {
	month := c.Query("month")
	year := c.Query("year")
	if month == "" || year == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "month and year are required",
		})
		return
	}
	if err := validateMonthAndYear(month, year); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	filter, opt, err := getMonthFilterAndOptions(month, year)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	cursor, err := s.db.Collection(runsCollectionName).Find(c, filter, opt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	var runs []leaderBoardRun
	if err = cursor.All(c, &runs); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, getLeaderboardResponse{
		RunsList: runs,
	})
	return
}

func getMonthFilterAndOptions(month string, year string) (bson.M, *options.FindOptions, error) {
	monthInt, err := strconv.Atoi(month)
	if err != nil {
		return nil, nil, err
	}
	yearInt, err := strconv.Atoi(year)
	if err != nil {
		return nil, nil, err
	}

	// make a date filter for my time values and sort
	startTime := time.Date(yearInt, time.Month(monthInt), 1, 0, 0, 0, 0, time.UTC)
	endTime := startTime.AddDate(0, 1, 0)
	filter := bson.M{
		"date": bson.M{"$gte": startTime, "$lt": endTime},
	}
	opt := options.Find().SetSort(bson.D{{"distance", -1}}).SetLimit(10)
	return filter, opt, nil
}

func validateMonthAndYear(month string, year string) error {
	monthInt, err := strconv.Atoi(month)
	if err != nil {
		return err
	}
	yearInt, err := strconv.Atoi(year)
	if err != nil {
		return err
	}

	if monthInt < 1 || monthInt > 12 {
		return ErrInvalidDateParameters
	}
	if yearInt < 1970 {
		return ErrInvalidDateParameters
	}

	return nil
}
