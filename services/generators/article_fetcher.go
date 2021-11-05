//go:generate mockgen -source=article_fetcher.go -destination=./mock/mock_article_fetcher.go -package=mock ArticleFetcher
package generators

type ArticleFetcher interface {
	Fetch(url string) (string, string, error)
	IsFetchable(url string) bool
}
