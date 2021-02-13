package generators

import (
	"github.com/stretchr/testify/require"
	"testing"
)

func TestIsKindOfYoutube(t *testing.T) {
	g := articleYoutubeGenerator{}
	require.True(t, g.IsKindOfYoutube("https://www.youtube.com/watch?v=6bCiSCkxI90&ab_channel=%EC%A4%80%ED%94%8C%EB%A6%AC"))
	require.False(t, g.IsKindOfYoutube("https://www.youtube.com/watch?vv=6bCiSCkxI90&ab_channel=%EC%A4%80%ED%94%8C%EB%A6%AC"))
}
