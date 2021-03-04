package generators

type ArticleFetcher interface {
	Fetch(url string) (string, string, error)
	IsFetchable(url string) bool
}
