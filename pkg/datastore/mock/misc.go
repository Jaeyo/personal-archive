package mock

type MiscDatastoreMock struct {
	OnCreateOrUpdateKeyValue func(key, value string) error
	OnGetValue       func(key string) (string, error)
	OnDeleteByKeys   func(keys []string) error
}

func (m *MiscDatastoreMock) CreateOrUpdateKeyValue(key, value string) error {
	return m.OnCreateOrUpdateKeyValue(key, value)
}

func (m *MiscDatastoreMock) GetValue(key string) (string, error) {
	return m.OnGetValue(key)
}

func (m *MiscDatastoreMock) DeleteValueByKeys(keys []string) error {
	return m.OnDeleteByKeys(keys)
}

