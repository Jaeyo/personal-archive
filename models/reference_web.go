package models

import (
	"gorm.io/gorm"
	"time"
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
	ids := []int64{}
	for _, refWeb := range a {
		ids = append(ids, refWeb.ID)
	}
	return ids
}

func (a ReferenceWebs) ContainURL(url string) bool {
	for _, refWeb := range a {
		if refWeb.URL == url {
			return true
		}
	}
	return false
}
