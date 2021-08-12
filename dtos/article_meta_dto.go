package dtos

import (
	"github.com/jaeyo/personal-archive/models"
	"time"
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
	ids := []int64{}
	for _, articleMeta := range a {
		ids = append(ids, articleMeta.Tags.ExtractIDs()...)
	}
	return ids
}
