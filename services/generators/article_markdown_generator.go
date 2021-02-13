package generators

import (
	"fmt"
	"github.com/PuerkitoBio/goquery"
	"github.com/go-shiori/go-readability"
	"github.com/jaeyo/personal-archive/common/markdown"
	"github.com/pkg/errors"
	"io/ioutil"
	"net/http"
	"os"
	"os/exec"
	"strings"
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
	title, htmlContent, err := g.extractReadable(url)
	if err != nil {
		return "", "", errors.Wrap(err, "failed to extract readable")
	}

	markdownContent, err := markdown.ConvertFromHtml(htmlContent)
	if err != nil {
		return "", "", errors.Wrap(err, "failed to convert html to markdown")
	}

	return title, markdownContent, nil
}

func (g *articleMarkdownGenerator) extractReadable(url string) (string, string, error) {
	resp, err := http.Get(url)
	if err != nil {
		return "", "", errors.Wrap(err, "failed to request url")
	}
	defer resp.Body.Close()
	if resp.StatusCode != 200 {
		return "", "", fmt.Errorf("response code is not success: %d", resp.StatusCode)
	}

	doc, err := goquery.NewDocumentFromReader(resp.Body)
	if err != nil {
		return "", "", errors.Wrap(err, "failed to parse response body")
	}

	// 코드 블럭의 랭기지 타입은 주로 class 에 `language-go` 와 같은 형태로 지정되어 있는 경우가 많은데
	// readability 는 class 정보를 전부 날리기 때문에 랭기지 정보를 나중에는 확인할 수 없다.
	// 따라서 readability 가 날리지 않도록 별도의 `data-lang` attr 에 따로 박아넣는다.
	prefix := "language-"
	doc.Find("pre code").Each(func(i int, selection *goquery.Selection) {
		var classes []string
		classes = append(classes, strings.Split(selection.AttrOr("class", ""), " ")...)
		classes = append(classes, strings.Split(selection.Parent().AttrOr("class", ""), " ")...)

		for _, class := range classes {
			if strings.HasPrefix(class, prefix) {
				lang := class[len(prefix):]
				selection.SetAttr("data-lang", lang)
				return
			}
		}
	})

	html, err := doc.Html()
	if err != nil {
		return "", "", errors.Wrap(err, "failed to get html from goquery")
	}

	result, err := readability.FromReader(strings.NewReader(html), url)
	if err != nil {
		return "", "", errors.Wrap(err, "failed to execute readability module")
	}
	return result.Title, result.Content, nil
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
