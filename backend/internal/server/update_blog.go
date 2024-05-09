package server

import (
	"errors"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"net/http"
)

type updateBlogRequest struct {
	Location string   `bson:"location"`
	Bio      string   `bson:"bio"`
	Goals    []string `bson:"goals"`
}

func (s *Server) updateBlog(c *gin.Context) {
	//All fields not required
	//	Location    string             `bson:"location"`
	//	Bio         string             `bson:"bio"`
	//	Goals       []string             `bson:"goals"`

	// grab relevant blog from context
	username, exists := c.Get("username")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Username not found in the request context",
		})
		return
	}
	// extract update details
	var req updateBlogRequest
	err := c.ShouldBind(&req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	// update only fields which are specified
	update := bson.M{}
	if req.Location != "" {
		update["location"] = req.Location
	}
	if req.Bio != "" {
		update["bio"] = req.Bio
	}
	if req.Goals != nil {
		update["goals"] = req.Goals
	}

	opts := options.FindOneAndUpdate().SetReturnDocument(options.After)
	result := s.db.Collection(usersCollectionName).FindOneAndUpdate(c, bson.M{"username": username}, bson.M{"$set": update}, opts)
	if err = result.Err(); err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Username not found in database",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	// verify update
	var updatedUser updateBlogRequest
	if err := result.Decode(&updatedUser); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to decode updated document",
		})
		return
	}

	c.JSON(http.StatusOK, updatedUser)

}
