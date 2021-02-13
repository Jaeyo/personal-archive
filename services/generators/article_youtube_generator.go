package generators

import (
	"github.com/pkg/errors"
	"io/ioutil"
	"net/http"
	netUrl "net/url"
)

type articleYoutubeGenerator struct {
}

func (g *articleYoutubeGenerator) IsKindOfYoutube(url string) bool {
	u, err := netUrl.Parse(url)
	if err != nil {
		return false
	}

	cond := u.Scheme == "https"
	cond = cond && u.Host == "www.youtube.com"
	cond = cond && u.Path == "/watch"

	queryParams, err := netUrl.ParseQuery(u.RawQuery)
	if err != nil {
		return false
	}
	_, ok := queryParams["v"]
	cond = cond && ok

	return cond
}

func (g *articleYoutubeGenerator) GetTitleAndContent(url string) (string, string, error) {
	title, err := g.getTitle(url)
	if err != nil {
		return "", "", errors.Wrap(err, "failed to get title")
	}

	videoID, err := g.getVideoID(url)
	if err != nil {
		return "", "", errors.Wrap(err, "failed to get video id")
	}

	return title, videoID, nil
}

func (g *articleYoutubeGenerator) getTitle(url string) (string, error) {
	resp, err := http.Get(url)
	if err != nil {
		return "", errors.Wrap(err, "failed to request url")
	}
	defer resp.Body.Close()

	htmlByte, err := ioutil.ReadAll(resp.Body)
	html := string(htmlByte)

	return getTitleFromHtml(html)
}

func (g *articleYoutubeGenerator) getVideoID(url string) (string, error) {
	u, err := netUrl.Parse(url)
	if err != nil {
		return "", errors.Wrap(err, "failed to parse url")
	}

	queryParams, err := netUrl.ParseQuery(u.RawQuery)
	if err != nil {
		return "", errors.Wrap(err, "failed to parse raw query")
	}

	videoID, ok := queryParams["v"]
	if !ok {
		return "", errors.New("video id not exists")
	}

	return videoID[0], nil
}
