package models

import (
	"time"

	"github.com/jaeyo/personal-archive/common"
	"gorm.io/gorm"
)

type ReferenceWeb struct {
	ID           int64     `gorm:"column:id;primarykey" json:"id"`
	ParagraphID  int64     `gorm:"column:paragraph_id;type:integer;not null" json:"paragraphID"`
	URL          string    `gorm:"column:url;type:varchar(256);not null" json:"url"`
	Created      time.Time `gorm:"column:created;type:datetime;not null" json:"created"`
	LastModified time.Time `gorm:"column:last_modified;type:datetime;not null" json:"lastModified"`
}

func (w *ReferenceWeb) TableName() string {
	return "reference_web"
}

func (w *ReferenceWeb) BeforeSave(db *gorm.DB) error {
	if w.Created.IsZero() {
		w.Created = time.Now()
	}
	w.LastModified = time.Now()
	return nil
}

type ReferenceWebs []*ReferenceWeb

func (a ReferenceWebs) ExtractIDs() []int64 {
	return common.Map(a, func(refWeb *ReferenceWeb) int64 {
		return refWeb.ID
	})
}

func (a ReferenceWebs) ContainURL(url string) bool {
	return common.ContainsField(a, func(refWeb *ReferenceWeb) string {
		return refWeb.URL
	}, url)
}
