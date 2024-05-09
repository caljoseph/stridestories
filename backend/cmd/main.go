package main

import (
	"backend/internal/server"
	"log"
)

func main() {

	connString := "mongodb://localhost:27017"
	s, closeDBConn, err := server.NewServer(connString)
	if err != nil {
		log.Fatalf("Error construction the server: %v", err)
	}
	defer closeDBConn()

	r := server.NewRouter(s)
	err = r.Run(":8080")
	if err != nil {
		return
	}
}
