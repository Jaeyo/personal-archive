package models

import (
	"time"

	"github.com/jaeyo/personal-archive/common"
	"gorm.io/gorm"
)

type Paragraph struct {
	ID                int64             `gorm:"column:id;primarykey" json:"id"`
	NoteID            int64             `gorm:"column:note_id;type:integer;not null" json:"noteID"`
	Seq               int               `gorm:"column:seq;type:integer;not null" json:"seq"`
	Content           string            `gorm:"column:content;type:text" json:"content"`
	ReferenceArticles ReferenceArticles `gorm:"foreignKey:ParagraphID" json:"referenceArticles"`
	ReferenceWebs     ReferenceWebs     `gorm:"foreignKey:ParagraphID" json:"referenceWebs"`
	Created           time.Time         `gorm:"column:created;type:datetime;not null" json:"created"`
	LastModified      time.Time         `gorm:"column:last_modified;type:datetime;not null" json:"lastModified"`
}

func (p *Paragraph) TableName() string {
	return "paragraph"
}

func (p *Paragraph) BeforeSave(db *gorm.DB) error {
	if p.Created.IsZero() {
		p.Created = time.Now()
	}
	p.LastModified = time.Now()
	return nil
}

type Paragraphs []*Paragraph

func (p Paragraphs) ExtractIDs() []int64 {
	return common.Map(p, func(item *Paragraph) int64 { return item.ID })
}

func (p Paragraphs) ExtractReferenceArticleIDs() []int64 {
	return common.FlatMap(p, func(paragraph *Paragraph) []int64 {
		return paragraph.ReferenceArticles.ExtractIDs()
	})
}

func (p Paragraphs) ExtractReferenceArticleArticleIDs() []int64 {
	return common.FlatMap(p, func(paragraph *Paragraph) []int64 {
		return paragraph.ReferenceArticles.ExtractArticleIDs()
	})
}

func (p Paragraphs) ExtractReferenceWebIDs() []int64 {
	return common.FlatMap(p, func(paragraph *Paragraph) []int64 {
		return paragraph.ReferenceWebs.ExtractIDs()
	})
}

func (p Paragraphs) MaxSeq() int {
	seqs := common.Map(p, func(paragraph *Paragraph) int {
		return paragraph.Seq
	})

	return common.Max(seqs)
}
