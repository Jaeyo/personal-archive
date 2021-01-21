package http

import (
	"github.com/stretchr/testify/require"
	"testing"
)

func TestTotalPagesByCount(t *testing.T) {
	require.Equal(t, 0, totalPagesByCount(0))
	require.Equal(t, 1, totalPagesByCount(1))
	require.Equal(t, 1, totalPagesByCount(19))
	require.Equal(t, 1, totalPagesByCount(20))
	require.Equal(t, 2, totalPagesByCount(21))
	require.Equal(t, 500000000, totalPagesByCount(10000000000))
}
