package services

import (
	"github.com/golang/mock/gomock"
	"github.com/jaeyo/personal-archive/models"
	"github.com/jaeyo/personal-archive/pkg/datastore/mock"
	"github.com/stretchr/testify/require"
	"testing"
)

func TestUpdateTitle(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	articleDatastore := mock.NewMockArticleDatastore(ctrl)
	articleDatastore.
		EXPECT().
		ExistArticleByTitle(gomock.Any()).
		Return(true, nil)

	svc := &articleService{
		articleDatastore: articleDatastore,
	}

	// case 1: title duplicated
	err := svc.UpdateTitle(-1, "new title")

	require.EqualError(t, err, "title new title already exists")

	// case 2: title not duplicated
	var savedArticle *models.Article
	articleDatastore.
		EXPECT().
		ExistArticleByTitle(gomock.Any()).
		Return(false, nil)

	articleDatastore.
		EXPECT().
		GetArticleByID(gomock.Any()).
		Return(&models.Article{}, nil)

	articleDatastore.
		EXPECT().
		SaveArticle(gomock.Any()).
		DoAndReturn(func(article *models.Article) error {
			savedArticle = article
			return nil
		})

	err = svc.UpdateTitle(-1, "new title")

	require.NoError(t, err)
	require.Equal(t, savedArticle.Title, "new title")
}

func TestUpdateContent(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	articleDatastore := mock.NewMockArticleDatastore(ctrl)

	article := &models.Article{
		Content: "old_content",
	}

	var savedArticle *models.Article

	articleDatastore.
		EXPECT().
		GetArticleByID(gomock.Any()).
		Return(article, nil)

	articleDatastore.
		EXPECT().
		SaveArticle(gomock.Any()).
		DoAndReturn(func(article *models.Article) error {
			savedArticle = article
			return nil
		})

	svc := &articleService{
		articleDatastore: articleDatastore,
	}

	err := svc.UpdateContent(0, "new_content")
	require.NoError(t, err)

	require.NotNil(t, savedArticle)
	require.Equal(t, "new_content", savedArticle.Content)
}
