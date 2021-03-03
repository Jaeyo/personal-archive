package services

import (
	"github.com/jaeyo/personal-archive/common"
	"github.com/jaeyo/personal-archive/repositories"
	"github.com/pkg/errors"
	"sync"
)

const (
	AppVer = "app.version"
)

type AppService interface {
	PreserveVerInfo() error
}

type appService struct {
	miscRepository repositories.MiscRepository
	versionReader  common.VersionReader
}

var GetAppService = func() func() AppService {
	var instance AppService
	var once sync.Once

	return func() AppService {
		once.Do(func() {
			instance = &appService{
				miscRepository: repositories.GetMiscRepository(),
				versionReader:  common.NewVersionReader(),
			}
		})
		return instance
	}
}()

func (s *appService) PreserveVerInfo() error {
	ver, err := s.versionReader.Read()
	if err != nil {
		return errors.Wrap(err, "failed to read version")
	}

	if err := s.miscRepository.CreateOrUpdate(AppVer, ver); err != nil {
		return errors.Wrap(err, "failed to create / update")
	}
	return nil
}
