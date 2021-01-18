package models

import (
	"gorm.io/gorm"
	"time"
)

type Misc struct {
	ID           int64     `gorm:"column:id;primarykey" json:"id"`
	Key          string    `gorm:"column:key;varchar(60);not null" json:"key"`
	Value        string    `gorm:"column:value;text;not null" json:"value"`
	Created      time.Time `gorm:"column:created;type:datetime;not null" json:"created"`
	LastModified time.Time `gorm:"column:last_modified;type:datetime;not null" json:"lastModified"`
}

func (m *Misc) TableName() string {
	return "misc"
}

func (m *Misc) BeforeSave(db *gorm.DB) error {
	if m.Created.IsZero() {
		m.Created = time.Now()
	}
	m.LastModified = time.Now()
	return nil
}
