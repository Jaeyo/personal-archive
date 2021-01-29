package repositories

import (
	"github.com/jaeyo/personal-archive/internal"
	"github.com/jaeyo/personal-archive/models"
	"sync"
)

type ParagraphRepository interface {
	DeleteByIDs(ids []int64) error
}

type paragraphRepository struct {
	database *internal.DB
}

var GetParagraphRepository = func() func() ParagraphRepository {
	var instance ParagraphRepository
	var once sync.Once

	return func() ParagraphRepository {
		once.Do(func() {
			instance = &paragraphRepository{
				database: internal.GetDatabase(),
			}
		})
		return instance
	}
}()

func (r *paragraphRepository) DeleteByIDs(ids []int64) error {
	return r.database.Where("id IN ?", ids).Delete(&models.Paragraph{}).Error
}
