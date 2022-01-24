package models

import (
	"github.com/jaeyo/personal-archive/common"
)

type ArticleTag struct {
	ID        int64  `gorm:"column:id;primarykey" json:"id"`
	Tag       string `gorm:"column:tag;type:varchar(512);not null" json:"tag"`
	ArticleID int64  `gorm:"column:article_id;type:integer;not null" json:"articleID"`
}

func (t *ArticleTag) TableName() string {
	return "article_tag"
}

type ArticleTags []*ArticleTag

func (t ArticleTags) FilterExcluded(tags common.Strings) (ArticleTags, ArticleTags) {
	var excluded, notExcluded = common.SplitBy(t, func(item *ArticleTag) bool {
		return tags.Contains(item.Tag)
	})
	return excluded, notExcluded
}

func (t ArticleTags) ContainsTag(tag string) bool {
	return common.ContainsField(t, func(item *ArticleTag) string { return item.Tag }, tag)
}

func (t ArticleTags) ExtractIDs() []int64 {
	return common.Map(t, func(item *ArticleTag) int64 { return item.ID })
}

type Tags []string

func (t Tags) FilterExcluded(articleTags ArticleTags) Tags {
	var result, _ []string = common.SplitBy(t, func(item string) bool { return !articleTags.ContainsTag(item) })
	return result
}

func (t Tags) RemoveDuplicates() Tags {
	return common.Unique(t)
}

type ArticleTagCountDTO struct {
	Tag   string `gorm:"column:tag" json:"tag"`
	Count int    `gorm:"column:cnt" json:"count"`
}
