package mock

type MiscRepositoryMock struct {
	OnCreateOrUpdate func(key, value string) error
	OnGetValue       func(key string) (string, error)
	OnDeleteByKeys   func(keys []string) error
}

func (m *MiscRepositoryMock) CreateOrUpdate(key, value string) error {
	return m.OnCreateOrUpdate(key, value)
}

func (m *MiscRepositoryMock) GetValue(key string) (string, error) {
	return m.OnGetValue(key)
}

func (m *MiscRepositoryMock) DeleteByKeys(keys []string) error {
	return m.OnDeleteByKeys(keys)
}
