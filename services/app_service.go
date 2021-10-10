package services

import (
	"github.com/jaeyo/personal-archive/common"
	"github.com/jaeyo/personal-archive/pkg/datastore"
	"github.com/pkg/errors"
)

const (
	AppVer = "app.version"
)

type AppService interface {
	PreserveVerInfo() error
}

type appService struct {
	miscDatastore datastore.MiscDatastore
	versionReader common.VersionReader
}

func NewAppService(miscDatastore datastore.MiscDatastore) AppService {
	return &appService{
		miscDatastore: miscDatastore,
		versionReader: common.NewVersionReader(),
	}
}

func (s *appService) PreserveVerInfo() error {
	ver, err := s.versionReader.Read()
	if err != nil {
		return errors.Wrap(err, "failed to read version")
	}

	if err := s.miscDatastore.CreateOrUpdateKeyValue(AppVer, ver); err != nil {
		return errors.Wrap(err, "failed to create / update")
	}
	return nil
}
