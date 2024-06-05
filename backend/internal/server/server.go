package server

import (
	"backend/internal/mongoutils"
	"errors"
	"fmt"
	"go.mongodb.org/mongo-driver/mongo"
)

const dbName = "startup"

var ErrNewServerFailed = errors.New("failed to create a new Server")

type Server struct {
	db *mongo.Database
}

func NewServer(connString string) (server *Server, closeDBConnection func(), err error) {
	client, closeDBConnection, err := mongoutils.NewClient(connString)
	if err != nil {
		return nil, nil, fmt.Errorf("%w: %w", ErrNewServerFailed, err)
	}

	// Get our database.
	db := client.Database(dbName)

	// Create and return the Server type.
	server = &Server{
		db: db,
	}
	return server, closeDBConnection, nil
}
