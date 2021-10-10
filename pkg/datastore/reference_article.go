package datastore

import "github.com/jaeyo/personal-archive/models"

type ReferenceArticleDatastore interface {
	DeleteReferenceArticleByIDs(ids []int64) error
}

func (d *Datastore) DeleteReferenceArticleByIDs(ids []int64) error {
	return d.database.Where("id IN ?", ids).Delete(&models.ReferenceArticle{}).Error
}
