package controllers

import (
	"github.com/jaeyo/personal-archive/common/http"
	"github.com/jaeyo/personal-archive/controllers/reqres"
	"github.com/jaeyo/personal-archive/repositories"
	"github.com/jaeyo/personal-archive/services"
	"github.com/labstack/echo/v4"
	"github.com/pkg/errors"
	"gorm.io/gorm"
)

type NoteController struct {
	noteService         services.NoteService
	noteRepository      repositories.NoteRepository
	articleRepository   repositories.ArticleRepository
	paragraphRepository repositories.ParagraphRepository
}

func NewNoteController() *NoteController {
	return &NoteController{
		noteService:         services.GetNoteService(),
		noteRepository:      repositories.GetNoteRepository(),
		articleRepository:   repositories.GetArticleRepository(),
		paragraphRepository: repositories.GetParagraphRepository(),
	}
}

func (c *NoteController) Route(e *echo.Echo) {
	e.GET("/apis/notes", http.Provide(c.FindNotes))
	e.GET("/apis/notes/:id", http.Provide(c.GetNote))
	e.PUT("/apis/notes/:id/title", http.Provide(c.UpdateTitle))
	e.PUT("/apis/notes/:id/paragraphs/swap", http.Provide(c.SwapParagraphs))
	e.PUT("/apis/notes/:id/paragraphs/:paragraphID", http.Provide(c.EditParagraph))
	e.POST("/apis/notes", http.Provide(c.CreateNote))
	e.POST("/apis/notes/:id/paragraphs", http.Provide(c.CreateParagraph))
	e.GET("/apis/notes/title", http.Provide(c.FindNoteTitles))
	e.GET("/apis/notes/search", http.Provide(c.SearchNote))
	e.DELETE("/apis/notes/:id", http.Provide(c.DeleteNote))
	e.DELETE("/apis/notes", http.Provide(c.DeleteNotes))
	e.DELETE("/apis/notes/:id/paragraphs/:paragraphID", http.Provide(c.DeleteParagraph))
}

func (c *NoteController) FindNotes(ctx http.ContextExtended) error {
	page, offset, limit := ctx.PageOffsetLimit()

	notes, cnt, err := c.noteRepository.FindAllWithPage(offset, limit)
	if err != nil {
		return ctx.InternalServerError(err, "failed to find notes")
	}

	return ctx.Success(reqres.NotesResponse{
		OK:         true,
		Notes:      notes,
		Pagination: http.NewPagination(page, cnt),
	})
}

func (c *NoteController) GetNote(ctx http.ContextExtended) error {
	id, err := ctx.ParamInt64("id")
	if err != nil {
		return ctx.BadRequest("invalid id")
	}

	note, err := c.noteRepository.GetByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return ctx.NotFoundf("failed to get note: %s", err.Error())
		}
		return ctx.InternalServerError(err, "failed to get note")
	}

	articleMetas, err := c.articleRepository.FindMetaByIDs(note.Paragraphs.ExtractReferenceArticleArticleIDs())
	if err != nil {
		return ctx.InternalServerError(err, "failed to find articles")
	}

	return ctx.Success(reqres.NoteAndReferenceArticlesResponse{
		OK:                     true,
		Note:                   note,
		ReferencedArticleMetas: articleMetas,
	})
}

func (c *NoteController) UpdateTitle(ctx http.ContextExtended) error {
	id, err := ctx.ParamInt64("id")
	if err != nil {
		return ctx.BadRequest("invalid id")
	}

	var req reqres.UpdateNoteTitleRequest
	if err := ctx.Bind(&req); err != nil {
		return ctx.BadRequestf("invalid request body: %s", err.Error())
	}

	if err := c.noteService.UpdateTitle(id, req.Title); err != nil {
		return ctx.InternalServerError(err, "failed to update title")
	}

	return ctx.Success(http.SuccessResponse{OK: true})
}

func (c *NoteController) SwapParagraphs(ctx http.ContextExtended) error {
	id, err := ctx.ParamInt64("id")
	if err != nil {
		return ctx.BadRequest("invalid id")
	}

	var req reqres.SwapParagraphSeqRequest
	if err := ctx.Bind(&req); err != nil {
		return ctx.BadRequestf("invalid request body: %s", err.Error())
	}

	if err := c.noteService.SwapParagraphs(id, req.AID, req.BID); err != nil {
		return ctx.InternalServerError(err, "failed to swap paragraphs")
	}

	return ctx.Success(http.SuccessResponse{OK: true})
}

func (c *NoteController) EditParagraph(ctx http.ContextExtended) error {
	id, err := ctx.ParamInt64("id")
	if err != nil {
		return ctx.BadRequest("invalid note id")
	}
	paragraphID, err := ctx.ParamInt64("paragraphID")
	if err != nil {
		return ctx.BadRequest("invalid paragraph id")
	}

	var req reqres.EditParagraphRequest
	if err := ctx.Bind(&req); err != nil {
		return ctx.BadRequestf("invalid request body: %s", err.Error())
	}

	if err := c.noteService.UpdateParagraph(id, paragraphID, req.Content, req.ReferenceArticleIDs, req.ReferenceWebURLs); err != nil {
		return ctx.InternalServerError(err, "failed to update paragraph")
	}

	return ctx.Success(http.SuccessResponse{OK: true})
}

func (c *NoteController) CreateNote(ctx http.ContextExtended) error {
	var req reqres.CreateNoteRequest
	if err := ctx.Bind(&req); err != nil {
		return ctx.BadRequestf("invalid request body: %s", err.Error())
	}

	note, err := c.noteService.Create(req.Title, req.Content, req.ReferenceArticleIDs, req.ReferenceWebURLs)
	if err != nil {
		return ctx.InternalServerError(err, "failed to create note")
	}

	return ctx.Success(reqres.NoteResponse{
		OK:   true,
		Note: note,
	})
}

func (c *NoteController) CreateParagraph(ctx http.ContextExtended) error {
	id, err := ctx.ParamInt64("id")
	if err != nil {
		return ctx.BadRequest("invalid note id")
	}

	var req reqres.CreateParagraphRequest
	if err := ctx.Bind(&req); err != nil {
		return ctx.BadRequestf("invalid request body: %s", err.Error())
	}

	note, err := c.noteService.CreateParagraph(id, req.Content, req.ReferenceArticleIDs, req.ReferenceWebURLs)
	if err != nil {
		return ctx.InternalServerError(err, "failed to create note")
	}

	return ctx.Success(reqres.NoteResponse{
		OK:   true,
		Note: note,
	})
}

func (c *NoteController) FindNoteTitles(ctx http.ContextExtended) error {
	notes, err := c.noteRepository.FindTitles()
	if err != nil {
		return ctx.InternalServerError(err, "failed to find note titles")
	}

	return ctx.Success(reqres.NotesResponse{
		OK:         true,
		Notes:      notes,
		Pagination: nil,
	})
}

func (c *NoteController) SearchNote(ctx http.ContextExtended) error {
	keyword := ctx.QueryParamStr("q")
	if len(keyword) <= 1 {
		return ctx.BadRequest("keyword should be more than 2 characters")
	}
	page, offset, limit := ctx.PageOffsetLimit()

	notes, cnt, err := c.noteService.Search(keyword, offset, limit)
	if err != nil {
		return ctx.InternalServerError(err, "failed to search")
	}

	return ctx.Success(reqres.NotesResponse{
		OK:         true,
		Notes:      notes,
		Pagination: http.NewPagination(page, cnt),
	})
}

func (c *NoteController) DeleteNote(ctx http.ContextExtended) error {
	id, err := ctx.ParamInt64("id")
	if err != nil {
		return ctx.BadRequest("invalid id")
	}

	if err := c.noteService.DeleteByIDs([]int64{id}); err != nil {
		return ctx.InternalServerError(err, "failed to delete note")
	}

	return ctx.Success(http.SuccessResponse{OK: true})
}

func (c *NoteController) DeleteNotes(ctx http.ContextExtended) error {
	ids, err := ctx.QueryParamInt64SliceWithComma("ids")
	if err != nil {
		return ctx.BadRequest("invalid ids")
	}

	if err := c.noteService.DeleteByIDs(ids); err != nil {
		return ctx.InternalServerError(err, "failed to delete notes")
	}

	return ctx.Success(http.SuccessResponse{OK: true})
}

func (c *NoteController) DeleteParagraph(ctx http.ContextExtended) error {
	id, err := ctx.ParamInt64("id")
	if err != nil {
		return ctx.BadRequest("invalid note id")
	}
	paragraphID, err := ctx.ParamInt64("paragraphID")
	if err != nil {
		return ctx.BadRequest("invalid paragraph id")
	}

	if err := c.paragraphRepository.DeleteByIDAndNoteID(id, paragraphID); err != nil {
		return ctx.InternalServerError(err, "failed to delete paragraph")
	}

	return ctx.Success(http.SuccessResponse{OK: true})
}
