package generators

import (
	"fmt"
	"github.com/pkg/errors"
	"github.com/tidwall/gjson"
	"io/ioutil"
	"net/http"
	"regexp"
)

const SlideShareUrlRegex = "https://www.slideshare.net/.*/.*"

type articleSlideShareGenerator struct {
}

func (g *articleSlideShareGenerator) IsKindOfSlideShare(url string) bool {
	return regexp.MustCompile(SlideShareUrlRegex).MatchString(url)
}

func (g *articleSlideShareGenerator) GetTitleAndContent(url string) (string, string, error) {
	oEmbedURL := fmt.Sprintf("http://www.slideshare.net/api/oembed/2?url=%s&format=json&maxwidth=800&maxheight=800", url)
	resp, err := http.Get(oEmbedURL)
	if err != nil {
		return "", "", errors.Wrap(err, "failed to request oEmbed")
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", "", fmt.Errorf("invalid status: %d", resp.StatusCode)
	}

	respBody, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return "", "", errors.Wrap(err, "failed to read body")
	}

	respJson := gjson.Parse(string(respBody))
	title := respJson.Get("title").String()
	embedHtml := respJson.Get("html").String()
	embedHtml = g.resize(embedHtml)

	return title, embedHtml, nil
}

func (g *articleSlideShareGenerator) resize(embedHtml string) string {
	reg := regexp.MustCompile("width=\"[0-9]+\" height=\"[0-9]+\"")
	return reg.ReplaceAllString(embedHtml, "width=\"800\" height=\"638\"")
}
