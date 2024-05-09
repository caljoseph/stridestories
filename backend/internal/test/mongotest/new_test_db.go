package mongotest

import (
	"fmt"
	"go.mongodb.org/mongo-driver/mongo"
	"log"
	"math/rand"
	"strings"
	"testing"
	"unicode/utf8"
)

const mongoMaxDBNameLength = 10

// NewTestDB creates a new mongo DB using the provided clients. The new DB will
// be named after the test name and the function will replace any invalid chars
// for db names with "_"s.
func NewTestDB(tb testing.TB, client *mongo.Client) *mongo.Database {
	tb.Helper()
	dbName := strings.ReplaceAll(tb.Name(), "/", "")
	dbName = ensureDBNameLength(dbName)

	log.Printf("Using database name: %s", dbName)
	return client.Database(dbName)
}

func ensureDBNameLength(dbName string) string {
	if utf8.RuneCountInString(dbName) > mongoMaxDBNameLength {
		truncatedName := string([]rune(dbName)[:mongoMaxDBNameLength-5])
		// If we have to truncate the name, append in a unique integer, so we don't
		// collide on similarly named tests.
		uniqueNum := rand.Intn(9000) + 1000 // 1000 to 9999
		return fmt.Sprintf("%s%d", truncatedName, uniqueNum)
	}

	return dbName
}
