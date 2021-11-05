package generators

import (
	"fmt"
	"github.com/golang/mock/gomock"
	"github.com/jaeyo/personal-archive/models"
	datastoreMock "github.com/jaeyo/personal-archive/pkg/datastore/mock"
	generatorMock "github.com/jaeyo/personal-archive/services/generators/mock"
	"github.com/stretchr/testify/require"
	"testing"
)

func TestFetch(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

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
				markdownFetcher:   getFetcherByKind(ctrl, models.KindMarkdown, tc.kind == models.KindMarkdown),
				tweetFetcher:      getFetcherByKind(ctrl, models.KindTweet, tc.kind == models.KindTweet),
				slideShareFetcher: getFetcherByKind(ctrl, models.KindSlideShare, tc.kind == models.KindSlideShare),
				youtubeFetcher:    getFetcherByKind(ctrl, models.KindYoutube, tc.kind == models.KindYoutube),
			}
			title, _, kind, err := gen.fetch("")
			require.NoError(t, err)
			require.Equal(t, tc.kind, kind)
			require.Equal(t, fmt.Sprintf("fetched by %s", tc.kind), title)
		})
	}
}

func getFetcherByKind(ctrl *gomock.Controller, kind string, fetchable bool) ArticleFetcher {
	fetcher := generatorMock.NewMockArticleFetcher(ctrl)

	fetcher.
		EXPECT().
		Fetch(gomock.Any()).
		AnyTimes().
		DoAndReturn(func(url string) (string, string, error) {
			return fmt.Sprintf("fetched by %s", kind), "", nil
		})

	fetcher.
		EXPECT().
		IsFetchable(gomock.Any()).
		AnyTimes().
		DoAndReturn(func(url string) bool {
			return fetchable
		})

	return fetcher
}

func TestGetUniqueTitle(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	articleDatastore := datastoreMock.NewMockArticleDatastore(ctrl)
	denyCnt := 5
	articleDatastore.
		EXPECT().
		ExistArticleByTitle(gomock.Any()).
		AnyTimes().
		DoAndReturn(func(title string) (bool, error) {
			denyCnt--
			return denyCnt >= 0, nil
		})

	gen := NewArticleGenerator(articleDatastore)
	title, err := gen.GetUniqueTitle("")

	require.NoError(t, err)
	require.Equal(t, "(1)(1)(1)(1)(1)", title)
}
