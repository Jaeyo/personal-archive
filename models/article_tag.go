package models

import (
	"github.com/jaeyo/personal-archive/common"
)

type ArticleTag struct {
	ID        int64  `gorm:"column:id;primarykey" json:"id"`
	Tag       string `gorm:"column:tag;type:varchar(60);not null" json:"tag"`
	ArticleID int64  `gorm:"column:article_id;type:integer;not null" json:"articleID"`
}

func (t *ArticleTag) TableName() string {
	return "article_tag"
}

type ArticleTags []*ArticleTag

func (t ArticleTags) FilterExcluded(tags common.Strings) (ArticleTags, ArticleTags) {
	var excluded, notExcluded ArticleTags
	for _, articleTag := range t {
		if tags.Contain(articleTag.Tag) {
			notExcluded = append(notExcluded, articleTag)
		} else {
			excluded = append(excluded, articleTag)
		}
	}
	return excluded, notExcluded
}

func (t ArticleTags) ContainTag(tag string) bool {
	for _, articleTag := range t {
		if articleTag.Tag == tag {
			return true
		}
	}
	return false
}

func (t ArticleTags) ExtractIDs() []int64 {
	ids := []int64{}
	for _, tag := range t {
		ids = append(ids, tag.ID)
	}
	return ids
}

type Tags []string

func (t Tags) FilterExcluded(articleTags ArticleTags) Tags {
	var result Tags
	for _, tag := range t {
		if !articleTags.ContainTag(tag) {
			result = append(result, tag)
		}
	}
	return result
}

type ArticleTagCountDTO struct {
	Tag   string `gorm:"column:tag" json:"tag"`
	Count int    `gorm:"column:cnt" json:"count"`
}
