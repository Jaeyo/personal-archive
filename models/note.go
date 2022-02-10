package models

import (
	"time"

	"github.com/jaeyo/personal-archive/common"
	"gorm.io/gorm"
)

type Note struct {
	ID           int64      `gorm:"column:id;primarykey" json:"id"`
	Title        string     `gorm:"column:title;type:varchar(256);not null;uniqueIndex" json:"title"`
	Paragraphs   Paragraphs `gorm:"foreignKey:NoteID" json:"paragraphs"`
	Created      time.Time  `gorm:"column:created;type:datetime;not null" json:"created"`
	LastModified time.Time  `gorm:"column:last_modified;type:datetime;not null" json:"lastModified"`
}

func (n *Note) GetContent() string {
	content := ""
	for _, paragraph := range n.Paragraphs {
		content += paragraph.Content + "\n"
	}
	return content
}

func (n *Note) TableName() string {
	return "note"
}

func (n *Note) BeforeSave(db *gorm.DB) error {
	if n.Created.IsZero() {
		n.Created = time.Now()
	}
	n.LastModified = time.Now()
	return nil
}

type Notes []*Note

func (n Notes) ExtractParagraphs() Paragraphs {
	return common.FlatMap(n, func(item *Note) []*Paragraph {
		return item.Paragraphs
	})
}
