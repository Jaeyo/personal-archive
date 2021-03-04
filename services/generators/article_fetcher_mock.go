package generators

type ArticleFetcherMock struct {
	OnFetch       func(url string) (string, string, error)
	OnIsFetchable func(url string) bool
}

func (m *ArticleFetcherMock) Fetch(url string) (string, string, error) {
	return m.OnFetch(url)
}

func (m *ArticleFetcherMock) IsFetchable(url string) bool {
	return m.OnIsFetchable(url)
}
