package services

import (
	"github.com/jaeyo/personal-archive/internal"
	"github.com/jaeyo/personal-archive/repositories"
	"github.com/pkg/errors"
	"gorm.io/gorm"
	"sync"
)

const PocketApplicationKey = "pocket.application_key"
const PocketAccessToken = "pocket.access_token"

type MiscService interface {
	SetPocketAuth(appKey, accessToken string) error
	GetPocketAuth() (string, string, error)
}

type miscService struct {
	miscRepository repositories.MiscRepository
}

var GetMiscService = func() func() MiscService {
	var instance MiscService
	var once sync.Once
	return func() MiscService {
		once.Do(func() {
			instance = &miscService{
				miscRepository: repositories.GetMiscRepository(),
			}
		})
		return instance
	}
}()

func (s *miscService) SetPocketAuth(appKey, accessToken string) error {
	tx := internal.GetDatabase().Begin()

	if err := s.miscRepository.CreateOrUpdate(tx, PocketApplicationKey, appKey); err != nil {
		tx.Rollback()
		return errors.Wrap(err, "failed to create / update pocket application key")
	}
	if err := s.miscRepository.CreateOrUpdate(tx, PocketAccessToken, accessToken); err != nil {
		tx.Rollback()
		return errors.Wrap(err, "failed to create / update pocket access token")
	}

	if err := tx.Commit().Error; err != nil {
		return errors.Wrap(err, "failed to commit")
	}
	return nil
}

func (s *miscService) GetPocketAuth() (string, string, error) {
	appKey, err := s.miscRepository.GetValue(PocketApplicationKey)
	if err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return "", "", errors.Wrap(err, "failed to get pocket application key")
		}
	}

	accessToken, err := s.miscRepository.GetValue(PocketAccessToken)
	if err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return "", "", errors.Wrap(err, "failed to get pocket access token")
		}
	}

	return appKey, accessToken, nil
}
