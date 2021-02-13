package generators

import (
	"github.com/pkg/errors"
	"regexp"
)

const TweetUrlRegex = "https://twitter.com/.*/status/([0-9]+)"

type articleTweetGenerator struct {
}

func (g *articleTweetGenerator) IsKindOfTweet(url string) bool {
	return regexp.MustCompile(TweetUrlRegex).MatchString(url)
}

func (g *articleTweetGenerator) GetTitleAndContent(url string) (string, string, error) {
	tweetID, err := g.extractTweetID(url)
	if err != nil {
		return "", "", errors.Wrap(err, "failed to extract tweet id")
	}

	return url, tweetID, nil
}

func (g *articleTweetGenerator) extractTweetID(url string) (string, error) {
	extracted := regexp.MustCompile(TweetUrlRegex).FindStringSubmatch(url)
	if len(extracted) > 2 {
		return "", errors.New("invalid tweet url")
	}
	return extracted[1], nil
}
