package repositories

import (
	"github.com/jaeyo/personal-archive/internal"
	"github.com/jaeyo/personal-archive/models"
	"github.com/pkg/errors"
	"gorm.io/gorm"
	"sync"
)

type MiscRepository interface {
	CreateOrUpdate(key, value string) error
	GetValue(key string) (string, error)
	DeleteByKeys(keys []string) error
}

type miscRepository struct {
	database *internal.DB
}

var GetMiscRepository = func() func() MiscRepository {
	var instance MiscRepository
	var once sync.Once

	return func() MiscRepository {
		once.Do(func() {
			instance = &miscRepository{
				database: internal.GetDatabase(),
			}
		})
		return instance
	}
}()

func (r *miscRepository) CreateOrUpdate(key, value string) error {
	var misc models.Misc
	if err := r.database.Where("key = ?", key).First(&misc).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			misc = models.Misc{}
		} else {
			return err
		}
	}

	misc.Key = key
	misc.Value = value

	return r.database.Save(&misc).Error
}

func (r *miscRepository) GetValue(key string) (string, error) {
	misc, err := r.getByKey(key)
	if err != nil {
		return "", err
	}
	return misc.Value, nil
}

func (r *miscRepository) DeleteByKeys(keys []string) error {
	return r.database.Where("key IN ?", keys).Delete(&models.Misc{}).Error
}

func (r *miscRepository) getByKey(key string) (*models.Misc, error) {
	var misc models.Misc
	if err := r.database.Where("key = ?", key).First(&misc).Error; err != nil {
		return nil, err
	}
	return &misc, nil
}
