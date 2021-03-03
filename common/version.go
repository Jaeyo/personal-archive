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
	verFile := "/app/VERSION.txt"
	if IsLocal() {
		verFile = "./VERSION.txt"
	}

	ver, err := ioutil.ReadFile(verFile)
	if err != nil {
		return "", errors.Wrap(err, "failed to read version.txt file")
	}
	return string(ver), nil
}
