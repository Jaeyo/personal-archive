package services

import (
	"github.com/jaeyo/personal-archive/common"
	"github.com/jaeyo/personal-archive/repositories/mock"
	"github.com/stretchr/testify/require"
	"testing"
)

func TestPreserveVerInfo(t *testing.T) {
	inVer := "0.0.10"
	var outKey, outVer string

	svc := appService{
		miscRepository: &mock.MiscRepositoryMock{
			OnCreateOrUpdate: func(key, value string) error {
				outKey = key
				outVer = value
				return nil
			},
		},
		versionReader: &common.VersionReaderMock{
			OnRead: func() (string, error) {
				return inVer, nil
			},
		},
	}

	err := svc.PreserveVerInfo()
	require.NoError(t, err)
	require.Equal(t, AppVer, outKey)
	require.Equal(t, inVer, outVer)
}
