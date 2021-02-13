package services

import (
	"github.com/jaeyo/personal-archive/common"
	"github.com/jaeyo/personal-archive/repositories"
	"github.com/pkg/errors"
	"io/ioutil"
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
}

var GetAppService = func() func() AppService {
	var instance AppService
	var once sync.Once

	return func() AppService {
		once.Do(func() {
			instance = &appService{
				miscRepository: repositories.GetMiscRepository(),
			}
		})
		return instance
	}
}()

func (s *appService) PreserveVerInfo() error {
	verFile := "/app/VERSION.txt"
	if common.IsLocal() {
		verFile = "./VERSION.txt"
	}

	verB, err := ioutil.ReadFile(verFile)
	if err != nil {
		return errors.Wrap(err, "failed to read version.txt file")
	}
	ver := string(verB)

	if err := s.miscRepository.CreateOrUpdate(AppVer, ver); err != nil {
		return errors.Wrap(err, "failed to create / update")
	}
	return nil
}
