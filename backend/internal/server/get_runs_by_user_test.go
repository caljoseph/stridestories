package server

import (
	strideassert "backend/internal/test/assert"
	striderequire "backend/internal/test/require"
	"encoding/json"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"net/http"
	"net/http/httptest"
	"testing"
)

func Test_GivenValidRegister_WhenInvalidRequest_ThenBadReqErr(t *testing.T) {

	testCases := []struct {
		name string
		run  map[string]interface{}
	}{
		{
			name: "date is a number",
			run: map[string]interface{}{
				"date":     5,
				"distance": 5.0,
				"duration": 3600.0,
				"runType":  "Interval",
				"notes":    "Terrible!",
				"location": "Bonneville",
				"title":    "Lunch run",
			},
		},
		{
			name: "bad run type",
			run: map[string]interface{}{
				"date":     5,
				"distance": 5.0,
				"duration": 3600.0,
				"runType":  "other",
				"notes":    "Terrible!",
				"location": "Bonneville",
				"title":    "Lunch run",
			},
		},
		{
			name: "all empty",
			run: map[string]interface{}{
				"date":     "",
				"distance": 0,
				"duration": 0,
				"runType":  "",
				"notes":    "",
				"location": "",
				"title":    "",
			},
		},
	}

	for _, tc := range testCases {
		tc := tc // Capture the range variables.
		t.Run(tc.name, func(t *testing.T) {
			t.Parallel()
			c := newTestClient(t)
			const un = "user"
			const pw = "pass"
			authToken := c.registerUser(t, withUsername(un), withPassword(pw))
			w := c.postRun(t, tc.run, authToken)
			strideassert.StatusCodeEqual(t, w, http.StatusBadRequest)
		})
	}

}

func Test_GivenValidRegisterAndPostRun_WhenValidUN_ThenCorrectRuns(t *testing.T) {
	t.Parallel()
	c := newTestClient(t)
	const un = "user"
	const pw = "pass"

	// Register
	authToken := c.registerUser(t, withUsername(un), withPassword(pw))

	// Post two runs
	firstRun := map[string]interface{}{
		"date":     "2024-05-01T00:00:00Z",
		"distance": 5.0,
		"duration": 3600.0,
		"runType":  "Interval",
		"notes":    "Terrible!",
		"location": "Bonneville",
		"title":    "Lunch run",
	}
	secondRun := map[string]interface{}{
		"date":     "2024-06-01T00:00:00Z",
		"distance": 50.0,
		"duration": 36000.0,
		"runType":  "Jog",
		"notes":    "Felt great!",
		"location": "Park",
		"title":    "Morning Run",
	}

	w := c.postRun(t, firstRun, authToken)
	striderequire.StatusCodeEqual(t, w, http.StatusCreated)
	w = c.postRun(t, secondRun, authToken)
	striderequire.StatusCodeEqual(t, w, http.StatusCreated)

	// Get the runs and decode them to a RunsList
	req := httptest.NewRequest(http.MethodGet, "/api/runs/"+un, nil)
	w = c.sendRequest(req)

	type getRunsResponse struct {
		RunsList []map[string]interface{} `json:"runsList"`
	}

	var resp getRunsResponse
	err := json.NewDecoder(w.Body).Decode(&resp)
	require.NoError(t, err, "Failed to decode response")

	runs := resp.RunsList
	require.Len(t, runs, 2, "Expected exactly 2 runs in the response")

	// Compare each expected run to the runs in the response
	assert.True(t, containsRun(runs, firstRun), "First run not found or does not match the posted data")
	assert.True(t, containsRun(runs, secondRun), "Second run not found or does not match the posted data")

}
func containsRun(runs []map[string]interface{}, expectedRun map[string]interface{}) bool {
	for _, r := range runs {
		match := true
		// Only check for keys that exist in the runs we posted
		for k, expectedValue := range expectedRun {
			if value, exists := r[k]; !exists || value != expectedValue {
				match = false
				break
			}
		}
		if match {
			return true
		}
	}
	return false
}
