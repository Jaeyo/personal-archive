package generators

import (
	"github.com/jaeyo/personal-archive/models"
	"github.com/jaeyo/personal-archive/repositories"
	"github.com/pkg/errors"
	"sync"
)

type ArticleGenerator interface {
	NewArticle(url string, tags []string) (*models.Article, error)
}

type articleGenerator struct {
	markdownGen       *articleMarkdownGenerator
	tweetGen          *articleTweetGenerator
	slideShareGen     *articleSlideShareGenerator
	youtubeGen        *articleYoutubeGenerator
	articleRepository repositories.ArticleRepository
}

var GetArticleGenerator = func() func() ArticleGenerator {
	var once sync.Once
	var instance ArticleGenerator
	return func() ArticleGenerator {
		once.Do(func() {
			instance = &articleGenerator{
				markdownGen:       &articleMarkdownGenerator{},
				tweetGen:          &articleTweetGenerator{},
				slideShareGen:     &articleSlideShareGenerator{},
				youtubeGen:        &articleYoutubeGenerator{},
				articleRepository: repositories.GetArticleRepository(),
			}
		})
		return instance
	}
}()

func (g *articleGenerator) NewArticle(url string, tags []string) (*models.Article, error) {
	title, content, kind, err := g.getTitleAndContentAndKind(url)
	if err != nil {
		return nil, errors.Wrap(err, "failed to get title/content/kind from url")
	}

	title, err = g.getUniqueTitle(title)
	if err != nil {
		return nil, errors.Wrap(err, "failed to get unique title")
	}

	return models.NewArticle(kind, url, content, title, tags), nil
}

func (g *articleGenerator) getTitleAndContentAndKind(url string) (string, string, string, error) {
	getTitleAndContentFn := g.markdownGen.GetTitleAndContent
	kind := models.KindMarkdown
	if g.tweetGen.IsKindOfTweet(url) {
		getTitleAndContentFn = g.tweetGen.GetTitleAndContent
		kind = models.KindTweet
	} else if g.slideShareGen.IsKindOfSlideShare(url) {
		getTitleAndContentFn = g.slideShareGen.GetTitleAndContent
		kind = models.KindSlideShare
	} else if g.youtubeGen.IsKindOfYoutube(url) {
		getTitleAndContentFn = g.youtubeGen.GetTitleAndContent
		kind = models.KindYoutube
	}

	title, content, err := getTitleAndContentFn(url)
	if err != nil {
		return "", "", "", err
	}

	return title, content, kind, nil
}

func (g *articleGenerator) getUniqueTitle(title string) (string, error) {
	isTitleExist, err := g.articleRepository.ExistByTitle(title)
	if err != nil {
		return "", errors.Wrap(err, "failed to check title duplication")
	}

	for isTitleExist {
		title += "(1)"
		isTitleExist, err = g.articleRepository.ExistByTitle(title)
		if err != nil {
			return "", errors.Wrap(err, "failed to check title duplication")
		}
	}

	return title, nil
}
