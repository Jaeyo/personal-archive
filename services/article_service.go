package services

import (
	"fmt"
	"github.com/jaeyo/personal-archive/dtos"
	"github.com/jaeyo/personal-archive/models"
	"github.com/jaeyo/personal-archive/pkg/datastore"
	"github.com/jaeyo/personal-archive/services/generators"
	"github.com/pkg/errors"
)

type ArticleService interface {
	Initialize()
	CreateByURL(url string, tags []string) (*dtos.ArticleMeta, error)
	Search(keyword string, offset, limit int) ([]*dtos.ArticleMeta, int64, error)
	UpdateTitle(id int64, newTitle string) error
	UpdateTags(id int64, tags []string) error
	UpdateContent(id int64, content string) error
	DeleteByIDs(ids []int64) error
}

type articleService struct {
	articleGenerator       generators.ArticleGenerator
	articleDatastore       datastore.ArticleDatastore
	articleTagDatastore    datastore.ArticleTagDatastore
	articleSearchDatastore datastore.ArticleSearchDatastore
}

func NewArticleService(
	articleGenerator generators.ArticleGenerator,
	articleDatastore datastore.ArticleDatastore,
	articleTagDatastore datastore.ArticleTagDatastore,
	articleSearchDatastore datastore.ArticleSearchDatastore,
) ArticleService {
	return &articleService{
		articleGenerator:       articleGenerator,
		articleDatastore:       articleDatastore,
		articleTagDatastore:    articleTagDatastore,
		articleSearchDatastore: articleSearchDatastore,
	}
}

func (s *articleService) Initialize() {
	if err := s.articleSearchDatastore.InitializeArticleSearch(); err != nil {
		panic(err)
	}
}

func (s *articleService) CreateByURL(url string, tags []string) (*dtos.ArticleMeta, error) {
	article, err := s.articleGenerator.NewArticle(url, tags)
	if err != nil {
		return nil, errors.Wrap(err, "failed to generate new article")
	}

	if err = s.articleDatastore.SaveArticle(article); err != nil {
		return nil, errors.Wrap(err, "failed to save article")
	}

	return dtos.NewArticleMeta(article), nil
}

func (s *articleService) Search(keyword string, offset, limit int) ([]*dtos.ArticleMeta, int64, error) {
	ids, err := s.articleSearchDatastore.SearchArticle(keyword)
	if err != nil {
		return nil, -1, errors.Wrap(err, "failed to search")
	}

	articleMetas, cnt, err := s.articleDatastore.FindArticleMetaByIDsWithPage(ids, offset, limit)
	if err != nil {
		return nil, -1, errors.Wrap(err, "failed to find article by ids")
	}

	return articleMetas, cnt, nil
}

func (s *articleService) UpdateTitle(id int64, newTitle string) error {
	exist, err := s.articleDatastore.ExistArticleByTitle(newTitle)
	if err != nil {
		return errors.Wrap(err, "failed to check exist by title")
	} else if exist {
		return fmt.Errorf("title %s already exists", newTitle)
	}

	article, err := s.articleDatastore.GetArticleByID(id)
	if err != nil {
		return errors.Wrap(err, "failed to get article")
	}

	article.Title = newTitle

	if err := s.articleDatastore.SaveArticle(article); err != nil {
		return errors.Wrap(err, "failed to save article")
	}
	return nil
}

func (s *articleService) UpdateTags(id int64, tags []string) error {
	article, err := s.articleDatastore.GetArticleByID(id)
	if err != nil {
		return errors.Wrap(err, "failed to get article")
	}

	toBeDeleted, toBePreserved := article.Tags.FilterExcluded(tags)
	toBeAdded := models.Tags(tags).
		FilterExcluded(article.Tags).
		RemoveDuplicates()

	if len(toBeDeleted) > 0 {
		if err := s.articleTagDatastore.DeleteArticleTag(toBeDeleted); err != nil {
			return errors.Wrap(err, "failed to delete unused article tags")
		}
	}

	article.Tags = toBePreserved

	if len(toBeAdded) > 0 {
		for _, tag := range toBeAdded {
			article.Tags = append(article.Tags, &models.ArticleTag{Tag: tag})
		}
		if err := s.articleDatastore.SaveArticle(article); err != nil {
			return errors.Wrap(err, "failed to save article")
		}
	}

	return nil
}

func (s *articleService) UpdateContent(id int64, content string) error {
	article, err := s.articleDatastore.GetArticleByID(id)
	if err != nil {
		return errors.Wrap(err, "failed to get article)")
	}

	article.Content = content

	if err := s.articleDatastore.SaveArticle(article); err != nil {
		return errors.Wrap(err, "failed to save article")
	}
	return nil
}

func (s *articleService) DeleteByIDs(ids []int64) error {
	articles, err := s.articleDatastore.FindArticleMetaByIDs(ids)
	if err != nil {
		return errors.Wrap(err, "failed to find articles")
	} else if len(ids) != len(articles) {
		return fmt.Errorf("invalid ids: %v", ids)
	}

	if err := s.articleTagDatastore.DeleteArticleTagsByIDs(articles.ExtractTagIDs()); err != nil {
		return errors.Wrap(err, "failed to delete article tag by ids")
	}

	if err := s.articleDatastore.DeleteArticleByIDs(ids); err != nil {
		return errors.Wrap(err, "failed to delete article by ids")
	}
	return nil
}
