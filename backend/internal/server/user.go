package server

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
	"time"
)

const usersCollectionName = "users"
const authCollectionName = "auth"

type User struct {
	ID          primitive.ObjectID `bson:"_id"`
	Username    string             `bson:"username"`
	Password    string             `bson:"password"`
	Location    string             `bson:"location"`
	Bio         string             `bson:"bio"`
	Goals       []string           `bson:"goals"`
	MemberSince primitive.DateTime `bson:"memberSince"`
}

func (s *Server) GetUser(c *gin.Context, username string) (*User, error) {
	var user User

	if err := s.db.Collection(usersCollectionName).FindOne(c, bson.M{"username": username}).Decode(&user); err != nil {
		return nil, err
	}
	return &user, nil
}
func (s *Server) CreateUser(c *gin.Context, username string, password string) (*User, error) {
	if user, _ := s.GetUser(c, username); user != nil {
		return nil, fmt.Errorf("username %s already exists", username)
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, fmt.Errorf("error hashing password: %w", err)
	}

	newUser := &User{
		ID:          primitive.NewObjectID(),
		Username:    username,
		Password:    string(hashedPassword),
		Location:    "",
		Bio:         "",
		Goals:       []string{},
		MemberSince: primitive.NewDateTimeFromTime(time.Now()),
	}

	_, err = s.db.Collection(usersCollectionName).InsertOne(c, newUser)
	if err != nil {
		return nil, fmt.Errorf("failed to insert new user: %w", err)
	}
	return newUser, nil
}
