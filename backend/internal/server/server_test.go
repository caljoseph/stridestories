package server

import (
	"backend/internal/test/mongotest"
	striderequire "backend/internal/test/require"
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/require"
	"go.mongodb.org/mongo-driver/mongo"
	"log"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

var testDBClient *mongo.Client

func TestMain(m *testing.M) {
	client, closeTestDBConn, err := mongotest.NewTestClient()
	if err != nil {
		log.Fatalf("Error kicking off tests: %v", err)
	}
	testDBClient = client
	defer closeTestDBConn()

	m.Run()
}

type testClient struct {
	r *gin.Engine
}

func newTestClient(t testing.TB) *testClient {
	t.Helper()

	db := mongotest.NewTestDB(t, testDBClient)
	server := &Server{
		db: db,
	}

	r := NewRouter(server)

	return &testClient{
		r: r,
	}
}

type sendRequestConfig struct {
	token string
}

type sendRequestOption func(config *sendRequestConfig)

func withToken(token string) sendRequestOption {
	return func(config *sendRequestConfig) {
		config.token = token
	}
}

func (c *testClient) sendRequest(req *http.Request, opts ...sendRequestOption) *httptest.ResponseRecorder {
	// Apply the options to the config struct.
	cfg := &sendRequestConfig{}
	for _, opt := range opts {
		opt(cfg)
	}

	// If a token was provided in the config, then add it to the cookie.
	if cfg.token != "" {
		req.AddCookie(&http.Cookie{
			Name:  authCookieName,
			Value: cfg.token,
		})
	}

	// Set the content type to application/json
	req.Header.Set("Content-Type", "application/json")

	// Send the request.
	w := httptest.NewRecorder()
	c.r.ServeHTTP(w, req)

	return w
}

type registerUserConfig struct {
	username string
	password string
}

type registerUserOption func(config *registerUserConfig)

func withUsername(username string) registerUserOption {
	return func(config *registerUserConfig) {
		config.username = username
	}
}

func withPassword(password string) registerUserOption {
	return func(config *registerUserConfig) {
		config.password = password
	}
}

func (c *testClient) registerUser(tb testing.TB, opts ...registerUserOption) string {
	cfg := &registerUserConfig{
		username: "test_username",
		password: "test_password",
	}
	for _, opt := range opts {
		opt(cfg)
	}

	// Register user.
	reqBody := fmt.Sprintf(
		`{"username": "%s", "password": "%s"}`,
		cfg.username,
		cfg.password,
	)
	req := httptest.NewRequest(http.MethodPost, "/api/register", strings.NewReader(reqBody))
	w := c.sendRequest(req)
	striderequire.StatusCodeEqual(tb, w, http.StatusOK)

	// Decode the register user response.
	res := struct {
		Username string `json:"username"`
	}{}
	err := json.NewDecoder(w.Body).Decode(&res)
	require.NoError(tb, err)
	require.NotEmpty(tb, res.Username)

	token := ""
	for _, cookie := range w.Result().Cookies() {
		if cookie.Name == authCookieName {
			token = cookie.Value
			break
		}
	}
	require.NotEmpty(tb, token, "Token should not be empty after register/login")

	return token
}

func (c *testClient) postRun(tb testing.TB, data map[string]interface{}, authToken string) *httptest.ResponseRecorder {
	jsonData, err := json.Marshal(data)
	require.NoError(tb, err)

	// manually set the cookie
	req := httptest.NewRequest(http.MethodPost, "/api/private/runs", strings.NewReader(string(jsonData)))
	req.Header.Set("Cookie", fmt.Sprintf("%s=%s", authCookieName, authToken))
	w := c.sendRequest(req)
	return w
}

func (c *testClient) getUserByUsername(tb testing.TB, username string) *getUserResponse {

	req := httptest.NewRequest(http.MethodGet, "/api/users/"+username, nil)
	w := c.sendRequest(req)
	striderequire.StatusCodeEqual(tb, w, http.StatusOK)

	var user getUserResponse

	err := json.NewDecoder(w.Body).Decode(&user)
	require.NoError(tb, err)

	return &user
}
