package generators

import (
	"github.com/stretchr/testify/require"
	"testing"
)

func TestIsKindOfSlideShare(t *testing.T) {
	gen := &articleSlideShareGenerator{}
	require.True(t, gen.IsKindOfSlideShare("https://www.slideshare.net/sanggi/ss-72845788"))
}

func TestResize(t *testing.T) {
	gen := &articleSlideShareGenerator{}
	src := "<iframe src=\"https://www.slideshare.net/slideshow/embed_code/key/1rjaIdJKRVdQrw\" width=\"400\" height=\"400\" frameborder=\"0\" marginwidth=\"0\" marginheight=\"0\" scrolling=\"no\" style=\"border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;\" allowfullscreen> </iframe> <div style=\"margin-bottom:5px\"> <strong> <a href=\"https://www.slideshare.net/hatemogi/devon2013-git\" title=\"devon2013: 사내Git저장소개발사례\" target=\"_blank\">devon2013: 사내Git저장소개발사례</a> </strong> from <strong><a href=\"https://www.slideshare.net/hatemogi\" target=\"_blank\">Daehyun Kim</a></strong> </div>"
	resized := gen.resize(src)
	expected := "<iframe src=\"https://www.slideshare.net/slideshow/embed_code/key/1rjaIdJKRVdQrw\" width=\"800\" height=\"638\" frameborder=\"0\" marginwidth=\"0\" marginheight=\"0\" scrolling=\"no\" style=\"border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;\" allowfullscreen> </iframe> <div style=\"margin-bottom:5px\"> <strong> <a href=\"https://www.slideshare.net/hatemogi/devon2013-git\" title=\"devon2013: 사내Git저장소개발사례\" target=\"_blank\">devon2013: 사내Git저장소개발사례</a> </strong> from <strong><a href=\"https://www.slideshare.net/hatemogi\" target=\"_blank\">Daehyun Kim</a></strong> </div>"
	require.Equal(t, expected, resized)
}
