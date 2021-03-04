package services

import (
	"github.com/jaeyo/personal-archive/models"
	"github.com/jaeyo/personal-archive/repositories/mock"
	"github.com/stretchr/testify/require"
	"testing"
)

func TestUpdateTitle(t *testing.T) {
	svc := &articleService{}

	// case 1: title duplicated
	svc.articleRepository = &mock.ArticleRepositoryMock{
		OnExistByTitle: func(title string) (bool, error) { return true, nil },
	}
	err := svc.UpdateTitle(-1, "new title")
	require.EqualError(t, err, "title new title already exists")

	// case 2: title not duplicated
	var savedArticle *models.Article
	svc.articleRepository = &mock.ArticleRepositoryMock{
		OnExistByTitle: func(title string) (bool, error) { return false, nil },
		OnGetByID: func(id int64) (*models.Article, error) { return &models.Article{}, nil },
		OnSave: func(article *models.Article) error {
			savedArticle = article
			return nil
		},
	}
	err = svc.UpdateTitle(-1, "new title")
	require.NoError(t, err)
	require.Equal(t, savedArticle.Title, "new title")
}
