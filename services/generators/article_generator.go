package generators

import (
	"github.com/jaeyo/personal-archive/models"
	"github.com/jaeyo/personal-archive/pkg/datastore"
	"github.com/pkg/errors"
)

type ArticleGenerator interface {
	NewArticle(url string, tags []string) (*models.Article, error)
	GetUniqueTitle(title string) (string, error)
}

type articleGenerator struct {
	markdownFetcher   ArticleFetcher
	tweetFetcher      ArticleFetcher
	slideShareFetcher ArticleFetcher
	youtubeFetcher    ArticleFetcher
	articleDatastore  datastore.ArticleDatastore
}

func NewArticleGenerator(articleDatastore datastore.ArticleDatastore) ArticleGenerator {
	return &articleGenerator{
		markdownFetcher:   &articleMarkdownFetcher{},
		tweetFetcher:      &articleTweetFetcher{},
		slideShareFetcher: &articleSlideShareFetcher{},
		youtubeFetcher:    &articleYoutubeFetcher{},
		articleDatastore:  articleDatastore,
	}
}

func (g *articleGenerator) NewArticle(url string, tags []string) (*models.Article, error) {
	title, content, kind, err := g.fetch(url)
	if err != nil {
		title = url
	}

	title, err = g.GetUniqueTitle(title)
	if err != nil {
		return nil, errors.Wrap(err, "failed to get unique title")
	}

	return models.NewArticle(kind, url, content, title, tags), nil
}

func (g *articleGenerator) fetch(url string) (string, string, string, error) {
	fetch := g.markdownFetcher.Fetch
	kind := models.KindMarkdown
	if g.tweetFetcher.IsFetchable(url) {
		fetch = g.tweetFetcher.Fetch
		kind = models.KindTweet
	} else if g.slideShareFetcher.IsFetchable(url) {
		fetch = g.slideShareFetcher.Fetch
		kind = models.KindSlideShare
	} else if g.youtubeFetcher.IsFetchable(url) {
		fetch = g.youtubeFetcher.Fetch
		kind = models.KindYoutube
	}

	title, content, err := fetch(url)
	if err != nil {
		return "", "", "", err
	}

	return title, content, kind, nil
}

func (g *articleGenerator) GetUniqueTitle(title string) (string, error) {
	isTitleExist, err := g.articleDatastore.ExistArticleByTitle(title)
	if err != nil {
		return "", errors.Wrap(err, "failed to check title duplication")
	}

	for isTitleExist {
		title += "(1)"
		isTitleExist, err = g.articleDatastore.ExistArticleByTitle(title)
		if err != nil {
			return "", errors.Wrap(err, "failed to check title duplication")
		}
	}

	return title, nil
}
