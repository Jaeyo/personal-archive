//go:generate mockgen -source=version.go -destination=./mock/mock_version.go -package=mock VersionReader
package common

import (
	"github.com/pkg/errors"
	"io/ioutil"
)

type VersionReader interface {
	Read() (string, error)
}

type versionReader struct {
}

func NewVersionReader() VersionReader {
	return &versionReader{}
}

func (r *versionReader) Read() (string, error) {
	if IsLocal() {
		return "test", nil
	}

	ver, err := ioutil.ReadFile("/app/VERSION.txt")
	if err != nil {
		return "", errors.Wrap(err, "failed to read version.txt file")
	}
	return string(ver), nil
}
