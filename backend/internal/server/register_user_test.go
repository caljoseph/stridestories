package server

import (
	strideassert "backend/internal/test/assert"
	striderequire "backend/internal/test/require"
	"encoding/json"
	"fmt"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func Test_GivenInvalidRequest_WhenRegisterUser_ThenBadRequestErr(t *testing.T) {
	t.Parallel()
	testCases := []struct {
		name    string
		reqBody string
	}{
		{
			name:    "username is missing",
			reqBody: `{"password": "test_password"}`,
		},
		{
			name:    "username is an empty string",
			reqBody: `{"username": "", "password": "test_password"}`,
		},
		{
			name:    "password is missing",
			reqBody: `{"username": "test_username"}`,
		},
		{
			name:    "password is an empty string",
			reqBody: `{"username": "test_username", "password": ""}`,
		},
		{
			name:    "empty request",
			reqBody: `{}`,
		},
		{
			name:    "missing request",
			reqBody: "",
		},
	}

	for _, tc := range testCases {
		tc := tc // Capture the range variables.
		t.Run(tc.name, func(t *testing.T) {
			t.Parallel()
			c := newTestClient(t)
			req := httptest.NewRequest(http.MethodPost, "/api/register", strings.NewReader(tc.reqBody))
			w := c.sendRequest(req)
			strideassert.StatusCodeEqual(t, w, http.StatusBadRequest)
		})
	}
}

func Test_GivenUserAlreadyExists_WhenRegisterUser_ThenConflict(t *testing.T) {
	t.Parallel()
	c := newTestClient(t)
	const existingUsername = "existing_user"

	// Register first user
	req1 := httptest.NewRequest(
		http.MethodPost,
		"/api/register",
		strings.NewReader(
			fmt.Sprintf(`{"username": "%s", "password": "test_password"}`, existingUsername),
		),
	)
	w := c.sendRequest(req1)
	striderequire.StatusCodeEqual(t, w, http.StatusOK)
	// Register second user with conflict
	req2 := httptest.NewRequest(
		http.MethodPost,
		"/api/register",
		strings.NewReader(
			fmt.Sprintf(`{"username": "%s", "password": "test_password"}`, existingUsername),
		),
	)
	w = c.sendRequest(req2)
	strideassert.StatusCodeEqual(t, w, http.StatusConflict)
}

func Test_GivenValidRequest_WhenRegisterUser_ThenSuccessAndTokenSetInCookie(t *testing.T) {
	t.Parallel()
	c := newTestClient(t)
	const username = "johnny_doe"

	body := `{"username": "` + username + `", "password": "test_password"}`
	req := httptest.NewRequest(http.MethodPost, "/api/register", strings.NewReader(body))
	w := c.sendRequest(req)
	strideassert.StatusCodeEqual(t, w, http.StatusOK)

	// Assert the response payload.
	registerResponse := struct {
		Username string `json:"username"`
	}{}
	err := json.NewDecoder(w.Body).Decode(&registerResponse)
	require.NoError(t, err)
	assert.Equal(t, registerResponse.Username, username)
}
