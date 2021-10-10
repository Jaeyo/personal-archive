package datastore

import (
	"github.com/jaeyo/personal-archive/models"
	"github.com/pkg/errors"
)

type ArticleTagDatastore interface {
	UpdateArticleTag(tag, newTag string) error
	FindArticleTagCounts() ([]*models.ArticleTagCountDTO, error)
	DeleteArticleTag(articleTags models.ArticleTags) error
	DeleteArticleTagsByIDs(ids []int64) error
}

func (d *Datastore) UpdateArticleTag(tag, newTag string) error {
	query := d.database.
		Model(&models.ArticleTag{}).
		Where("tag = ?", tag).
		Update("tag", newTag)
	if query.RowsAffected <= 0 {
		return errors.New("no row affected")
	}
	return query.Error
}

func (d *Datastore) FindArticleTagCounts() ([]*models.ArticleTagCountDTO, error) {
	var counts []*models.ArticleTagCountDTO
	err := d.database.
		Model(&models.ArticleTag{}).
		Select("tag", "count(*) AS cnt").
		Group("tag").
		Order("tag ASC").
		Find(&counts).Error
	return counts, err
}

func (d *Datastore) DeleteArticleTag(articleTags models.ArticleTags) error {
	return d.database.Delete(&articleTags).Error
}

func (d *Datastore) DeleteArticleTagsByIDs(ids []int64) error {
	return d.database.Where("id IN ?", ids).Delete(&models.ArticleTag{}).Error
}
