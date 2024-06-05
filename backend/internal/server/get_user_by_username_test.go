package server

import (
	strideassert "backend/internal/test/assert"
	"net/http"
	"net/http/httptest"
	"net/url"
	"testing"
)

func Test_GivenSuccessfulRegister_WhenMalformedRequest_ThenBadReqErr(t *testing.T) {
	testCases := []struct {
		name  string
		param string
	}{
		{
			name:  "empty string",
			param: "",
		},
		{
			name:  "spaces in path",
			param: "a a",
		},
	}

	for _, tc := range testCases {
		tc := tc // Capture the range variables.
		t.Run(tc.name, func(t *testing.T) {
			t.Parallel()
			c := newTestClient(t)
			req := httptest.NewRequest(http.MethodGet, "/api/users/"+url.PathEscape(tc.param), nil)
			w := c.sendRequest(req)
			strideassert.StatusCodeEqual(t, w, http.StatusBadRequest)
		})
	}
}

func Test_WhenRequestedUserDoesntExist_ThenNotFoundErr(t *testing.T) {
	t.Parallel()
	c := newTestClient(t)
	invalidUser := "doesn't_exist"

	req := httptest.NewRequest(http.MethodGet, "/api/users/"+invalidUser, nil)
	w := c.sendRequest(req)

	strideassert.StatusCodeEqual(t, w, http.StatusNotFound)
}
