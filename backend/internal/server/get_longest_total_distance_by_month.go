package server

import (
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"net/http"
	"strconv"
	"time"
)

func (s *Server) getLongestTotalDistanceByMonth(c *gin.Context) {

	month := c.Query("month")
	year := c.Query("year")
	if month == "" || year == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "month and year are required",
		})
		return
	}

	monthInt, err := strconv.Atoi(month)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid month format"})
		return
	}

	yearInt, err := strconv.Atoi(year)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid year format"})
		return
	}

	startTime := time.Date(yearInt, time.Month(monthInt), 1, 0, 0, 0, 0, time.UTC)
	endTime := startTime.AddDate(0, 1, 0)

	// implement stages to return list of 10 users with the top total mileage
	pipeline := mongo.Pipeline{
		// time window
		bson.D{{"$match", bson.M{
			"date": bson.M{"$gte": startTime, "$lt": endTime},
		}}},
		// sum by user
		bson.D{{"$group", bson.M{
			"_id":      "$username",
			"distance": bson.M{"$sum": "$distance"},
		}}},
		// make username equivalent to primary key
		bson.D{{"$project", bson.M{
			"username": "$_id",
			"distance": 1,
			"_id":      0,
		}}},
		// sort
		bson.D{{"$sort", bson.M{"distance": -1}}},
		// limit to 10
		bson.D{{"$limit", 10}},
	}

	// aggregate
	cursor, err := s.db.Collection(runsCollectionName).Aggregate(c, pipeline)
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
