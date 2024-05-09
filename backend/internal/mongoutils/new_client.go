package mongoutils

import (
	"context"
	"errors"
	"fmt"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
	"time"
)

const secondsToWaitForConnection = 10

var (
	ErrNewClientFailed         = errors.New("failed to create a new mongo client connection")
	ErrFailedTestingConnection = errors.New("failed when testing the connection")
)

func NewClient(connString string) (client *mongo.Client, closeConnection func(), err error) {
	// Create a context to use when connecting to the DB.
	ctx, cancel := context.WithTimeout(context.Background(), secondsToWaitForConnection*time.Second)
	defer cancel()

	// Connect to mongo.
	clientOptions := options.Client().ApplyURI(connString)
	client, err = mongo.Connect(ctx, clientOptions)
	if err != nil {
		return nil, nil, fmt.Errorf("%w: %w: connection string: %s", ErrNewClientFailed, err, connString)
	}

	// Test the connection
	err = client.Ping(ctx, nil)
	if err != nil {
		return nil, nil, fmt.Errorf("%w: %w: connection string: %s", ErrFailedTestingConnection, err, connString)
	}

	log.Println("Successfully connected to MongoDB!")

	return client, func() {
		log.Println("Closing the connection to MongoDB...")
		closeErr := client.Disconnect(context.Background())
		if closeErr != nil {
			log.Printf("Failed to close the connection with MongoDB: %v", closeErr)
		}
		log.Println("Successfully disconnected from MongoDB")
	}, nil
}
