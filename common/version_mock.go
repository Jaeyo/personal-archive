package common

type VersionReaderMock struct {
	OnRead func() (string, error)
}

func (m *VersionReaderMock) Read() (string, error) {
	return m.OnRead()
}
