package reqres

import (
	"github.com/jaeyo/personal-archive/common/http"
	"github.com/jaeyo/personal-archive/models"
)

type NotesResponse struct {
	OK         bool             `json:"ok"`
	Notes      []*models.Note   `json:"notes"`
	Pagination *http.Pagination `json:"pagination"`
}

type CreateNoteRequest struct {
	Title               string   `json:"title" validate:"required,max=1024"`
	Content             string   `json:"content" validate:"required,min=1"`
	ReferenceArticleIDs []int64  `json:"referenceArticleIDs"`
	ReferenceWebURLs    []string `json:"referenceWebUrls"`
}

type CreateParagraphRequest struct {
	Content             string   `json:"content" validate:"required,min=1"`
	ReferenceArticleIDs []int64  `json:"referenceArticleIDs"`
	ReferenceWebURLs    []string `json:"referenceWebUrls"`
}

type NoteResponse struct {
	OK   bool         `json:"ok"`
	Note *models.Note `json:"note"`
}

type NoteAndReferenceArticlesResponse struct {
	OK                 bool              `json:"ok"`
	Note               *models.Note      `json:"note"`
	ReferencedArticles []*models.Article `json:"referencedArticles"`
}

type UpdateNoteTitleRequest struct {
	Title string `json:"title" validate:"required,min=1,max=128"`
}

type SwapParagraphSeqRequest struct {
	AID int64 `json:"aID"`
	BID int64 `json:"bID"`
}

type EditParagraphRequest struct {
	Content             string   `json:"content" validate:"required,min=1"`
	ReferenceArticleIDs []int64  `json:"referenceArticleIDs"`
	ReferenceWebURLs    []string `json:"referenceWebUrls"`
}
