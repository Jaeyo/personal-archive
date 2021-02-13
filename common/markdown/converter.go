package markdown

import (
	md "github.com/JohannesKaufmann/html-to-markdown"
	"github.com/PuerkitoBio/goquery"
	"strings"
	"unicode/utf8"
)

func ConvertFromHtml(html string) (string, error) {
	return getConverter().ConvertString(html)
}

func getConverter() *md.Converter {
	converter := md.NewConverter("", true, &md.Options{
		HorizontalRule: "---",
	})

	converter.AddRules(
		// 코드 블록, 이전 단계에서 `data-lang` attr 에 박아놓은 랭기지 타입을 살린다.
		md.Rule{
			Filter: []string{"pre"},
			Replacement: func(_ string, selec *goquery.Selection, options *md.Options) *string {
				codeElement := selec.Find("code")
				language := codeElement.AttrOr("data-lang", "")

				code := codeElement.Text()
				if codeElement.Length() == 0 {
					code = selec.Text()
				}

				fenceChar, _ := utf8.DecodeRuneInString(options.Fence)
				fence := calculateCodeFence(fenceChar, code)

				text := "\n\n" + fence + language + "\n" +
					code +
					"\n" + fence + "\n\n"
				return &text
			},
		},
		// 라이브러리의 기본 "p", "div" 룰을 사용하면 코드 블럭에서 indent 가 사라지는 경우가 있음
		md.Rule{
			//
			Filter: []string{"p", "div"},
			Replacement: func(content string, selec *goquery.Selection, opt *md.Options) *string {
				content = "\n\n" + content + "\n\n"
				return &content
			},
		})

	return converter
}

func calculateCodeFence(fenceChar rune, content string) string {
	repeat := calculateCodeFenceOccurrences(fenceChar, content)

	// the outer fence block always has to have
	// at least one character more than any content inside
	repeat++

	// you have to have at least three fence characters
	// to be recognized as a code block
	if repeat < 3 {
		repeat = 3
	}

	return strings.Repeat(string(fenceChar), repeat)
}

func calculateCodeFenceOccurrences(fenceChar rune, content string) int {
	var occurrences []int

	var charsTogether int
	for _, char := range content {
		// we encountered a fence character, now count how many
		// are directly afterwards
		if char == fenceChar {
			charsTogether++
		} else if charsTogether != 0 {
			occurrences = append(occurrences, charsTogether)
			charsTogether = 0
		}
	}

	// if the last element in the content was a fenceChar
	if charsTogether != 0 {
		occurrences = append(occurrences, charsTogether)
	}

	return findMax(occurrences)
}

func findMax(a []int) (max int) {
	for i, value := range a {
		if i == 0 {
			max = a[i]
		}

		if value > max {
			max = value
		}
	}
	return max
}
