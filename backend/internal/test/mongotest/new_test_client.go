package mongotest

import (
	"backend/internal/mongoutils"
	"context"
	"errors"
	"fmt"
	"github.com/testcontainers/testcontainers-go"
	"github.com/testcontainers/testcontainers-go/wait"
	"go.mongodb.org/mongo-driver/mongo"
	"log"
	"time"
)

const (
	image                     = "mongo:5.0.13"
	secondsToWaitForContainer = 6
)

var ErrNewTestClientFailed = errors.New("failed to create the mongo test container")

func NewTestClient() (client *mongo.Client, closeConnection func(), err error) {
	// Kick off the mongo docker container.
	req := testcontainers.ContainerRequest{
		Image:        image,
		ExposedPorts: []string{"27017/tcp"},
		WaitingFor:   wait.ForLog("Waiting for connections").WithStartupTimeout(secondsToWaitForContainer * time.Second),
	}
	container, err := testcontainers.GenericContainer(context.Background(), testcontainers.GenericContainerRequest{
		ContainerRequest: req,
		Started:          true,
	})

	if err != nil {
		return nil, nil, fmt.Errorf("%w: %w", ErrNewTestClientFailed, err)
	}

	// Get the host for the running container.
	host, err := container.Endpoint(context.Background(), "")
	if err != nil {
		return nil, nil, fmt.Errorf("%w: %w", ErrNewTestClientFailed, err)
	}

	// Construct the connection string to the mongo instance using the container's host.
	connString := fmt.Sprintf("mongodb://%s", host)
	log.Printf("Test Mongo DB running at: %s", connString)

	// Create a connection.
	client, closeConnection, err = mongoutils.NewClient(connString)
	if err != nil {
		return nil, nil, fmt.Errorf("%w: %w", ErrNewTestClientFailed, err)
	}

	return client, closeConnection, nil
}
