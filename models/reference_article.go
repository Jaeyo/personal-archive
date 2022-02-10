package models

import (
	"time"

	"github.com/jaeyo/personal-archive/common"
	"gorm.io/gorm"
)

type ReferenceArticle struct {
	ID           int64     `gorm:"column:id;primarykey" json:"id"`
	ParagraphID  int64     `gorm:"column:paragraph_id;type:integer;not null" json:"paragraphID"`
	ArticleID    int64     `gorm:"column:article_id;type:integer;not null" json:"articleID"`
	Created      time.Time `gorm:"column:created;type:datetime;not null" json:"created"`
	LastModified time.Time `gorm:"column:last_modified;type:datetime;not null" json:"lastModified"`
}

func (a *ReferenceArticle) TableName() string {
	return "reference_article"
}

func (a *ReferenceArticle) BeforeSave(db *gorm.DB) error {
	if a.Created.IsZero() {
		a.Created = time.Now()
	}
	a.LastModified = time.Now()
	return nil
}

type ReferenceArticles []*ReferenceArticle

func (a ReferenceArticles) ExtractIDs() []int64 {
	return common.Map(a, func(refArticle *ReferenceArticle) int64 {
		return refArticle.ID
	})
}

func (a ReferenceArticles) ExtractArticleIDs() []int64 {
	return common.Map(a, func(refArticle *ReferenceArticle) int64 {
		return refArticle.ArticleID
	})
}

func (a ReferenceArticles) ContainArticleID(articleID int64) bool {
	articleIDs := common.Map(a, func(refArticle *ReferenceArticle) int64 {
		return refArticle.ArticleID
	})

	return common.Contains(articleIDs, articleID)
}
