package services

import (
	"github.com/golang/mock/gomock"
	"github.com/jaeyo/personal-archive/common/mock"
	dsMock "github.com/jaeyo/personal-archive/pkg/datastore/mock"
	"github.com/stretchr/testify/require"
	"testing"
)

func TestPreserveVerInfo(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	inVer := "0.0.10"
	var outKey, outVer string

	miscDatastore := dsMock.NewMockMiscDatastore(ctrl)
	miscDatastore.
		EXPECT().
		CreateOrUpdateKeyValue(gomock.Any(), gomock.Any()).
		DoAndReturn(func(key, value string) error {
			outKey = key
			outVer = value
			return nil
		})

	versionReader := mock.NewMockVersionReader(ctrl)
	versionReader.
		EXPECT().
		Read().
		DoAndReturn(func() (string, error) {
			return inVer, nil
		})

	svc := appService{
		miscDatastore: miscDatastore,
		versionReader: versionReader,
	}

	err := svc.PreserveVerInfo()
	require.NoError(t, err)
	require.Equal(t, AppVer, outKey)
	require.Equal(t, inVer, outVer)
}
