package repositories

import (
	"github.com/jaeyo/personal-archive/internal"
	"github.com/jaeyo/personal-archive/models"
	"sync"
)

type ReferenceArticleRepository interface {
	DeleteByIDs(ids []int64) error
}

type referenceArticleRepository struct {
	database *internal.DB
}

var GetReferenceArticleRepository = func() func() ReferenceArticleRepository {
	var instance ReferenceArticleRepository
	var once sync.Once

	return func() ReferenceArticleRepository {
		once.Do(func() {
			instance = &referenceArticleRepository{
				database: internal.GetDatabase(),
			}
		})
		return instance
	}
}()

func (r *referenceArticleRepository) DeleteByIDs(ids []int64) error {
	return r.database.Where("id IN ?", ids).Delete(&models.ReferenceArticle{}).Error
}
