package dtos

import (
	"time"

	"github.com/jaeyo/personal-archive/common"
	"github.com/jaeyo/personal-archive/models"
)

type ArticleMeta struct {
	ID           int64              `gorm:"column:id;primarykey" json:"id"`
	Kind         string             `gorm:"column:kind;type:varchar(24);not null" json:"kind"`
	URL          string             `gorm:"column:url;type:varchar(256);not null" json:"url"`
	Title        string             `gorm:"column:title;type:varchar(256);not null;uniqueIndex" json:"title"`
	Tags         models.ArticleTags `gorm:"foreignKey:ArticleID" json:"tags"`
	Created      time.Time          `gorm:"column:created;type:datetime;not null" json:"created"`
	LastModified time.Time          `gorm:"column:last_modified;type:datetime;not null" json:"lastModified"`
}

func (a *ArticleMeta) TableName() string {
	return "article"
}

func NewArticleMeta(article *models.Article) *ArticleMeta {
	return &ArticleMeta{
		ID:           article.ID,
		Kind:         article.Kind,
		URL:          article.URL,
		Title:        article.Title,
		Tags:         article.Tags,
		Created:      article.Created,
		LastModified: article.LastModified,
	}
}

type ArticleMetas []*ArticleMeta

func (a ArticleMetas) ExtractTagIDs() []int64 {
	return common.FlatMap(a, func(articleMeta *ArticleMeta) []int64 { return articleMeta.Tags.ExtractIDs() })
}
