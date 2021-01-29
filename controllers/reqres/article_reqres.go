package reqres

import (
	"fmt"
	"github.com/jaeyo/personal-archive/common/http"
	"github.com/jaeyo/personal-archive/models"
)

type CreateArticleByURLRequest struct {
	URL  string   `json:"url" validate:"required,max=1024"`
	Tags []string `json:"tags"`
}

func (r *CreateArticleByURLRequest) Validate() error {
	return validateTags(r.Tags)
}

type UpdateArticleTitleRequest struct {
	Title string `json:"title" validate:"required,min=1,max=128"`
}

type UpdateTagsRequest struct {
	Tags []string `json:"tags"`
}

func (r *UpdateTagsRequest) Validate() error {
	return validateTags(r.Tags)
}

type UpdateContentRequest struct {
	Content string `json:"content" validate:"required"`
}

type ArticleResponse struct {
	OK      bool            `json:"ok"`
	Article *models.Article `json:"article"`
}

type ArticlesResponse struct {
	OK         bool              `json:"ok"`
	Articles   []*models.Article `json:"articles"`
	Pagination *http.Pagination   `json:"pagination"`
}

func validateTags(tags []string) error {
	for _, tag := range tags {
		if tag == "untagged" {
			return fmt.Errorf("'untagged' tag reserved")
		} else if tag == "all" {
			return fmt.Errorf("'all' tag reserved")
		} else if len(tag) > 36 {
			return fmt.Errorf("tag should be less than 36: %s", tag)
		}
	}
	return nil
}
