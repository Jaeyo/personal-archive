package datastore

import "github.com/jaeyo/personal-archive/models"

type ReferenceWebDatastore interface {
	DeleteReferenceWebByIDs(ids []int64) error
}

func (d *Datastore) DeleteReferenceWebByIDs(ids []int64) error {
	return d.database.Where("id IN ?", ids).Delete(&models.ReferenceWeb{}).Error
}

