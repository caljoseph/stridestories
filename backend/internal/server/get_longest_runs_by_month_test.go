package server

import (
	strideassert "backend/internal/test/assert"
	"net/http"
	"net/http/httptest"
	"testing"
)

func Test_GivenInvalidDates_WhenGetLRBM_ThenInvalidDateErr(t *testing.T) {
	t.Parallel()

	tests := []struct {
		name string
		path string
	}{
		{"No month or year", "/api/runs/longest_runs_by_month?"},
		{"Only month", "/api/runs/longest_runs_by_month?month=11"},
		{"Only year", "/api/runs/longest_runs_by_month?year=2024"},
		{"Valid month but year too old", "/api/runs/longest_runs_by_month?month=11&year=1969"},
		{"Month zero", "/api/runs/longest_runs_by_month?month=0&year=2024"},
		{"Month too large", "/api/runs/longest_runs_by_month?month=13&year=2024"},
	}

	c := newTestClient(t)

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			req := httptest.NewRequest(http.MethodGet, tc.path, nil)
			w := c.sendRequest(req)
			strideassert.StatusCodeEqual(t, w, http.StatusBadRequest)
		})
	}
}

func Test_GivenValidDates_WhenGetLRBM_ThenSuccess(t *testing.T) {
	c := newTestClient(t)
	validParams := "?month=5&year=2024"

	req := httptest.NewRequest(http.MethodGet, "/api/runs/longest_runs_by_month"+validParams, nil)
	w := c.sendRequest(req)
	strideassert.StatusCodeEqual(t, w, http.StatusOK)

}
