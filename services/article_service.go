package services

import (
	"fmt"
	"github.com/jaeyo/personal-archive/models"
	"github.com/jaeyo/personal-archive/repositories"
	"github.com/jaeyo/personal-archive/services/generators"
	"github.com/pkg/errors"
	"sync"
)

type ArticleService interface {
	Initialize()
	CreateByURL(url string, tags []string) (*models.Article, error)
	Search(keyword string, offset, limit int) ([]*models.Article, int64, error)
	UpdateTitle(id int64, newTitle string) error
	UpdateTags(id int64, tags []string) error
	UpdateContent(id int64, content string) error
	DeleteByIDs(ids []int64) error
}

type articleService struct {
	articleGenerator        generators.ArticleGenerator
	articleRepository       repositories.ArticleRepository
	articleTagRepository    repositories.ArticleTagRepository
	articleSearchRepository repositories.ArticleSearchRepository
}

var GetArticleService = func() func() ArticleService {
	var once sync.Once
	var instance ArticleService
	return func() ArticleService {
		once.Do(func() {
			instance = &articleService{
				articleGenerator:        generators.GetArticleGenerator(),
				articleRepository:       repositories.GetArticleRepository(),
				articleTagRepository:    repositories.GetArticleTagRepository(),
				articleSearchRepository: repositories.GetArticleSearchRepository(),
			}
		})
		return instance
	}
}()

func (s *articleService) Initialize() {
	if err := s.articleSearchRepository.Initialize(); err != nil {
		panic(err)
	}
}

func (s *articleService) CreateByURL(url string, tags []string) (*models.Article, error) {
	article, err := s.articleGenerator.NewArticle(url, tags)
	if err != nil {
		return nil, errors.Wrap(err, "failed to generate new article")
	}

	if err = s.articleRepository.Save(article); err != nil {
		return nil, errors.Wrap(err, "failed to save article")
	}

	return article, nil
}

func (s *articleService) Search(keyword string, offset, limit int) ([]*models.Article, int64, error) {
	ids, err := s.articleSearchRepository.Search(keyword)
	if err != nil {
		return nil, -1, errors.Wrap(err, "failed to search")
	}

	articles, cnt, err := s.articleRepository.FindByIDsWithPage(ids, offset, limit)
	if err != nil {
		return nil, -1, errors.Wrap(err, "failed to find article by ids")
	}

	return articles, cnt, nil
}

func (s *articleService) UpdateTitle(id int64, newTitle string) error {
	exist, err := s.articleRepository.ExistByTitle(newTitle)
	if err != nil {
		return errors.Wrap(err, "failed to check exist by title")
	} else if exist {
		return fmt.Errorf("title %s already exists", newTitle)
	}

	article, err := s.articleRepository.GetByID(id)
	if err != nil {
		return errors.Wrap(err, "failed to get article")
	}

	article.Title = newTitle

	if err := s.articleRepository.Save(article); err != nil {
		return errors.Wrap(err, "failed to save article")
	}
	return nil
}

func (s *articleService) UpdateTags(id int64, tags []string) error {
	article, err := s.articleRepository.GetByID(id)
	if err != nil {
		return errors.Wrap(err, "failed to get article")
	}

	toBeDeleted, toBePreserved := article.Tags.FilterExcluded(tags)
	toBeAdded := models.Tags(tags).FilterExcluded(article.Tags)

	if len(toBeDeleted) > 0 {
		if err := s.articleTagRepository.Delete(toBeDeleted); err != nil {
			return errors.Wrap(err, "failed to delete unused article tags")
		}
	}

	article.Tags = toBePreserved

	if len(toBeAdded) > 0 {
		for _, tag := range toBeAdded {
			article.Tags = append(article.Tags, &models.ArticleTag{Tag: tag})
		}
		if err := s.articleRepository.Save(article); err != nil {
			return errors.Wrap(err, "failed to save article")
		}
	}

	return nil
}

func (s *articleService) UpdateContent(id int64, content string) error {
	article, err := s.articleRepository.GetByID(id)
	if err != nil {
		return errors.Wrap(err, "failed to get article)")
	}

	article.Content = content

	if err := s.articleRepository.Save(article); err != nil {
		return errors.Wrap(err, "failed to save article")
	}
	return nil
}

func (s *articleService) DeleteByIDs(ids []int64) error {
	articles, err := s.articleRepository.FindByIDs(ids)
	if err != nil {
		return errors.Wrap(err, "failed to find articles")
	} else if len(ids) != len(articles) {
		return fmt.Errorf("invalid ids: %v", ids)
	}

	if err := s.articleTagRepository.DeleteByIDs(articles.ExtractTagIDs()); err != nil {
		return errors.Wrap(err, "failed to delete article tag by ids")
	}

	if err := s.articleRepository.DeleteByIDs(ids); err != nil {
		return errors.Wrap(err, "failed to delete article by ids")
	}
	return nil
}
