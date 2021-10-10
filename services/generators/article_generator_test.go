package generators

import (
	"fmt"
	"github.com/jaeyo/personal-archive/models"
	"github.com/jaeyo/personal-archive/pkg/datastore/mock"
	"github.com/stretchr/testify/require"
	"testing"
)

func TestFetch(t *testing.T) {
	tests := []struct {
		name string
		kind string
	}{
		{name: "markdown", kind: models.KindMarkdown},
		{name: "tweet", kind: models.KindTweet},
		{name: "slideshare", kind: models.KindSlideShare},
		{name: "youtube", kind: models.KindYoutube},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			gen := &articleGenerator{
				markdownFetcher:   getFetcherByKind(models.KindMarkdown, tc.kind == models.KindMarkdown),
				tweetFetcher:      getFetcherByKind(models.KindTweet, tc.kind == models.KindTweet),
				slideShareFetcher: getFetcherByKind(models.KindSlideShare, tc.kind == models.KindSlideShare),
				youtubeFetcher:    getFetcherByKind(models.KindYoutube, tc.kind == models.KindYoutube),
			}
			title, _, kind, err := gen.fetch("")
			require.NoError(t, err)
			require.Equal(t, tc.kind, kind)
			require.Equal(t, fmt.Sprintf("fetched by %s", tc.kind), title)
		})
	}
}

func getFetcherByKind(kind string, fetchable bool) ArticleFetcher {
	return &ArticleFetcherMock{
		OnFetch: func(url string) (string, string, error) {
			return fmt.Sprintf("fetched by %s", kind), "", nil
		},
		OnIsFetchable: func(url string) bool {
			return fetchable
		},
	}
}

func TestGetUniqueTitle(t *testing.T) {
	for i := 0; i < 10; i++ {
		cnt := i
		t.Run(fmt.Sprintf("retry-%d", cnt), func(t *testing.T) {
			articleDatastore := &mock.ArticleDatastoreMock{
				OnExistArticleByTitle: func(title string) (bool, error) {
					cnt--
					return cnt >= 0, nil
				},
			}

			gen := NewArticleGenerator(articleDatastore)
			title, err := gen.GetUniqueTitle("")

			require.NoError(t, err)
			require.Equal(t, 3 * i, len(title))
		})
	}
}
