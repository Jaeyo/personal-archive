//go:generate mockgen -source=misc.go -destination=./mock/mock_misc.go -package=mock MiscDatastore
package datastore

import (
	"github.com/jaeyo/personal-archive/models"
	"github.com/pkg/errors"
	"gorm.io/gorm"
)

type MiscDatastore interface {
	CreateOrUpdateKeyValue(key, value string) error
	GetValue(key string) (string, error)
	DeleteValueByKeys(keys []string) error
}

func (d *Datastore) CreateOrUpdateKeyValue(key, value string) error {
	var misc models.Misc
	if err := d.database.Where("key = ?", key).First(&misc).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			misc = models.Misc{}
		} else {
			return err
		}
	}

	misc.Key = key
	misc.Value = value

	return d.database.Save(&misc).Error
}

func (d *Datastore) GetValue(key string) (string, error) {
	misc, err := d.getByKey(key)
	if err != nil {
		return "", err
	}
	return misc.Value, nil
}

func (d *Datastore) DeleteValueByKeys(keys []string) error {
	return d.database.Where("key IN ?", keys).Delete(&models.Misc{}).Error
}

func (d *Datastore) getByKey(key string) (*models.Misc, error) {
	var misc models.Misc
	if err := d.database.Where("key = ?", key).First(&misc).Error; err != nil {
		return nil, err
	}
	return &misc, nil
}
