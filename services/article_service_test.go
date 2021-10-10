package services

import (
	"github.com/jaeyo/personal-archive/models"
	"github.com/jaeyo/personal-archive/pkg/datastore/mock"
	"github.com/stretchr/testify/require"
	"testing"
)

func TestUpdateTitle(t *testing.T) {
	svc := &articleService{}

	// case 1: title duplicated
	svc.articleDatastore = &mock.ArticleDatastoreMock{
		OnExistArticleByTitle: func(title string) (bool, error) { return true, nil },
	}
	err := svc.UpdateTitle(-1, "new title")
	require.EqualError(t, err, "title new title already exists")

	// case 2: title not duplicated
	var savedArticle *models.Article
	svc.articleDatastore = &mock.ArticleDatastoreMock{
		OnExistArticleByTitle: func(title string) (bool, error) { return false, nil },
		OnGetArticleByID:      func(id int64) (*models.Article, error) { return &models.Article{}, nil },
		OnSaveArticle: func(article *models.Article) error {
			savedArticle = article
			return nil
		},
	}
	err = svc.UpdateTitle(-1, "new title")
	require.NoError(t, err)
	require.Equal(t, savedArticle.Title, "new title")
}

func TestUpdateContent(t *testing.T) {
	svc := &articleService{}

	article := &models.Article{
		Content: "old_content",
	}

	var savedArticle *models.Article

	svc.articleDatastore = &mock.ArticleDatastoreMock{
		OnGetArticleByID: func(id int64) (*models.Article, error) {
			return article, nil
		},
		OnSaveArticle: func(article *models.Article) error {
			savedArticle = article
			return nil
		},
	}

	err := svc.UpdateContent(0, "new_content")
	require.NoError(t, err)

	require.NotNil(t, savedArticle)
	require.Equal(t, "new_content", savedArticle.Content)
}
