package server

import (
	"context"
	"errors"
	"fmt"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"time"
)

const dbName = "startup"

var ErrNewServerFailed = errors.New("failed to create a new Server")

type Server struct {
	db *mongo.Database
}

func NewServer(connString string) (*Server, error) {
	// Create a context to use when connecting to the DB.
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Connect to mongo.
	clientOptions := options.Client().ApplyURI(connString)
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		return nil, fmt.Errorf("%w: %w", ErrNewServerFailed, err)
	}

	// Get our database.
	db := client.Database(dbName)

	// Create and return the Server type.
	return &Server{
		db: db,
	}, nil
}
