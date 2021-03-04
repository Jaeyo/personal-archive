package generators

import (
	"github.com/stretchr/testify/require"
	"testing"
)

func TestIsFetchableYoutube(t *testing.T) {
	g := articleYoutubeFetcher{}
	require.True(t, g.IsFetchable("https://www.youtube.com/watch?v=6bCiSCkxI90&ab_channel=%EC%A4%80%ED%94%8C%EB%A6%AC"))
	require.False(t, g.IsFetchable("https://www.youtube.com/watch?vv=6bCiSCkxI90&ab_channel=%EC%A4%80%ED%94%8C%EB%A6%AC"))
}
