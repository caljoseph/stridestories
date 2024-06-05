package assert

import (
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"net/http/httptest"
	"testing"
)

func StatusCodeEqual(tb testing.TB, w *httptest.ResponseRecorder, expected int) {
	tb.Helper()
	require.NotNilf(tb, w, "response is nil")
	assert.Equalf(
		tb,
		expected,
		w.Code,
		"expected status code %v, got %v\nResponse Body: %v",
		expected,
		w.Code,
		w.Body,
	)
}
