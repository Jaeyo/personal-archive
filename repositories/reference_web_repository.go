package repositories

import (
	"github.com/jaeyo/personal-archive/internal"
	"github.com/jaeyo/personal-archive/models"
	"sync"
)

type ReferenceWebRepository interface {
	DeleteByIDs(ids []int64) error
}

type referenceWebRepository struct {
	database *internal.DB
}

var GetReferenceWebRepository = func() func() ReferenceWebRepository {
	var instance ReferenceWebRepository
	var once sync.Once

	return func() ReferenceWebRepository {
		once.Do(func() {
			instance = &referenceWebRepository{
				database: internal.GetDatabase(),
			}
		})
		return instance
	}
}()

func (r *referenceWebRepository) DeleteByIDs(ids []int64) error {
	return r.database.Where("id IN ?", ids).Delete(&models.ReferenceWeb{}).Error
}
