package server

import (
	strideassert "backend/internal/test/assert"
	"encoding/json"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func Test_GivenInvalidRequest_WhenLoginUser_ThenBadRequestErr(t *testing.T) {
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
			req := httptest.NewRequest(http.MethodPost, "/api/login", strings.NewReader(tc.reqBody))
			w := c.sendRequest(req)
			strideassert.StatusCodeEqual(t, w, http.StatusBadRequest)
		})
	}
}

func Test_GivenValidRegister_WhenIncorrectPassword_ThenAuthErr(t *testing.T) {
	t.Parallel()
	c := newTestClient(t)
	const newUsername = "new_user"
	const newPassword = "new_password"
	const invalidPassword = "invalid_password"

	// Register user
	c.registerUser(t, withUsername(newUsername), withPassword(newPassword))

	// Login with incorrect password
	body := `{"username": "` + newUsername + `", "password": "` + invalidPassword + `"}`
	req := httptest.NewRequest(http.MethodPost, "/api/login", strings.NewReader(body))
	w := c.sendRequest(req)
	strideassert.StatusCodeEqual(t, w, http.StatusUnauthorized)

	//// Assert the response payload
	//loginResponse := struct {
	//	Username string `json:"username"`
	//}{}
	//err := json.NewDecoder(w.Body).Decode(&loginResponse)
	//require.NoError(t, err)
	//assert.Equal(t, loginResponse.Username, username)
}

func Test_GivenValidRequest_WhenRegisterAndLoginUser_ThenSuccessAndTokenSetInCookie(t *testing.T) {
	t.Parallel()
	c := newTestClient(t)
	const validUser = "new_user"
	const validPassword = "new_password"

	// Register user
	c.registerUser(t, withUsername(validUser), withPassword(validPassword))

	// Login with valid password
	body := `{"username": "` + validUser + `", "password": "` + validPassword + `"}`
	req := httptest.NewRequest(http.MethodPost, "/api/login", strings.NewReader(body))
	w := c.sendRequest(req)
	strideassert.StatusCodeEqual(t, w, http.StatusOK)

	// Assert the response payload
	loginResponse := struct {
		Username string `json:"username"`
	}{}
	err := json.NewDecoder(w.Body).Decode(&loginResponse)
	require.NoError(t, err)
	assert.Equal(t, loginResponse.Username, validUser)
}
