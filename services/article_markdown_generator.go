package services

import (
	md "github.com/JohannesKaufmann/html-to-markdown"
	"github.com/PuerkitoBio/goquery"
	"github.com/go-shiori/go-readability"
	"github.com/pkg/errors"
	"io/ioutil"
	"net/http"
	"os"
	"os/exec"
	"strings"
	"time"
)

type articleMarkdownGenerator struct {
}

func (g *articleMarkdownGenerator) GetTitleAndContent(url string) (string, string, error) {
	title, content, err := g.getTitleAndContent1(url)
	if err == nil {
		return title, content, nil
	}

	return g.getTitleAndContent2(url)
}

func (g *articleMarkdownGenerator) getTitleAndContent1(url string) (string, string, error) {
	result, err := readability.FromURL(url, 5*time.Second)
	if err != nil {
		return "", "", errors.Wrap(err, "failed to execute readability module")
	}

	content, err := md.
		NewConverter("", true, &md.Options{
			HorizontalRule: "---",
		}).
		ConvertString(result.Content)

	if err != nil {
		return "", "", errors.Wrap(err, "failed to convert html to markdown")
	}

	return result.Title, content, nil
}

func (g *articleMarkdownGenerator) getTitleAndContent2(url string) (string, string, error) {
	resp, err := http.Get(url)
	if err != nil {
		return "", "", err
	}
	defer resp.Body.Close()

	htmlByte, err := ioutil.ReadAll(resp.Body)
	html := string(htmlByte)

	title, err := getTitleFromHtml(html)
	if err != nil || title == "" {
		title = url
	}

	f, err := ioutil.TempFile("", "")
	if err != nil {
		return "", "", errors.Wrap(err, "failed to create temp file")
	}
	defer os.Remove(f.Name())

	if err := ioutil.WriteFile(f.Name(), htmlByte, 0644); err != nil {
		return "", "", errors.Wrap(err, "failed to write html file")
	}

	out, err := exec.Command("./bin/html2text.py", "-b", "0", "-d", f.Name()).Output()
	if err != nil {
		return "", "", errors.Wrap(err, "failed to execute html2text")
	}
	content := string(out)

	return title, content, nil
}

func getTitleFromHtml(html string) (string, error) {
	doc, err := goquery.NewDocumentFromReader(strings.NewReader(html))
	if err != nil {
		return "", err
	}

	return doc.Find("title").Text(), nil
}
