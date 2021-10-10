package datastore

import (
	"github.com/jaeyo/personal-archive/common"
	"github.com/jaeyo/personal-archive/models"
	"github.com/pkg/errors"
)

type ArticleSearchDatastore interface {
	InitializeArticleSearch() error
	InsertArticleSearch(article *models.Article) error
	UpdateArticleSearch(article *models.Article) error
	DeleteArticleSearch(id int64) error
	DeleteArticleSearches(ids []int64) error
	SearchArticle(keyword string) ([]int64, error)
}

func (d *Datastore) InitializeArticleSearch() error {
	tables, err := d.database.Tables()
	if err != nil {
		return errors.Wrap(err, "failed to find tables")
	}

	if common.Strings(tables).Contain("article_search") {
		return nil
	}

	sqlDB, err := d.database.DB.DB()
	if err != nil {
		return err
	}
	if _, err := sqlDB.Exec("CREATE VIRTUAL TABLE article_search USING FTS5 (id, title, content)"); err != nil {
		return err
	}

	return nil
}

func (d *Datastore) InsertArticleSearch(article *models.Article) error {
	return d.database.Exec("INSERT INTO article_search (id, title, content) VALUES (?, ?, ?)", article.ID, article.Title, article.Content).Error
}

func (d *Datastore) UpdateArticleSearch(article *models.Article) error {
	return d.database.Exec("UPDATE article_search SET title = ?, content = ? WHERE id = ?", article.Title, article.Content, article.ID).Error
}

func (d *Datastore) DeleteArticleSearch(id int64) error {
	return d.database.Exec("DELETE FROM article_search WHERE id = ?", id).Error
}

func (d *Datastore) DeleteArticleSearches(ids []int64) error {
	return d.database.Exec("DELETE FROM article_search WHERE id IN ?", ids).Error
}

func (d *Datastore) SearchArticle(keyword string) ([]int64, error) {
	return d.database.SearchIDs("article_search", keyword)
}
