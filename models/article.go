package models

import (
	"github.com/jaeyo/personal-archive/common"
	"gorm.io/gorm"
	"time"
)

const (
	KindMarkdown   = "markdown"
	KindTweet      = "tweet"
	KindSlideShare = "slideshare"
	KindYoutube    = "youtube"
)

type Article struct {
	ID           int64       `gorm:"column:id;primarykey" json:"id"`
	Kind         string      `gorm:"column:kind;type:varchar(24);not null" json:"kind"`
	URL          string      `gorm:"column:url;type:varchar(256);not null" json:"url"`
	Content      string      `gorm:"column:content;type:text" json:"content"`
	Title        string      `gorm:"column:title;type:varchar(256);not null;uniqueIndex" json:"title"`
	Tags         ArticleTags `gorm:"foreignKey:ArticleID" json:"tags"`
	Created      time.Time   `gorm:"column:created;type:datetime;not null" json:"created"`
	LastModified time.Time   `gorm:"column:last_modified;type:datetime;not null" json:"lastModified"`
}

func NewArticle(kind, url, content, title string, tags []string) *Article {
	articleTags := common.Map(tags, func(item string) *ArticleTag { return &ArticleTag{Tag: item} })

	return &Article{
		Kind:    kind,
		URL:     url,
		Content: content,
		Title:   title,
		Tags:    articleTags,
	}
}

func (a *Article) TableName() string {
	return "article"
}

func (a *Article) BeforeSave(db *gorm.DB) error {
	if a.Created.IsZero() {
		a.Created = time.Now()
	}
	a.LastModified = time.Now()
	return nil
}
