package http

import (
	"fmt"
	"github.com/go-shiori/go-readability"
	"github.com/stretchr/testify/require"
	"testing"
	"time"
)

func TestTotalPagesByCount(t *testing.T) {
	require.Equal(t, 0, totalPagesByCount(0))
	require.Equal(t, 1, totalPagesByCount(1))
	require.Equal(t, 1, totalPagesByCount(19))
	require.Equal(t, 1, totalPagesByCount(20))
	require.Equal(t, 2, totalPagesByCount(21))
	require.Equal(t, 500000000, totalPagesByCount(10000000000))
}

func TestA(t *testing.T) {
	url := "https://martinfowler.com/articles/developer-effectiveness.html"
	article, err := readability.FromURL(url, 5 * time.Second)
	require.NoError(t, err)
	fmt.Println(article.Content)
}