package server

import (
	"errors"
	"fmt"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
	"time"
)

const usersCollectionName = "users"
const authCollectionName = "auth"

var ErrExistingUser = errors.New("this username is already taken")

type user struct {
	ID          primitive.ObjectID `bson:"_id"`
	Username    string             `bson:"username"`
	Password    string             `bson:"password"`
	Location    string             `bson:"location"`
	Bio         string             `bson:"bio"`
	Goals       []string           `bson:"goals"`
	MemberSince primitive.DateTime `bson:"member_since"`
}

func (s *Server) getUser(c *gin.Context, username string) (*user, error) {
	var user user

	if err := s.db.Collection(usersCollectionName).FindOne(c, bson.M{"username": username}).Decode(&user); err != nil {
		return nil, err
	}
	return &user, nil
}
func (s *Server) createUser(c *gin.Context, username string, password string) (*user, error) {
	if user, _ := s.getUser(c, username); user != nil {
		return nil, ErrExistingUser
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, fmt.Errorf("error hashing password: %w", err)
	}

	newUser := &user{
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
