package controllers

import (
	"github.com/jaeyo/personal-archive/common/http"
	"github.com/jaeyo/personal-archive/controllers/reqres"
	"github.com/jaeyo/personal-archive/models"
	"github.com/jaeyo/personal-archive/repositories"
	"github.com/jaeyo/personal-archive/services"
	"github.com/labstack/echo/v4"
	"github.com/pkg/errors"
	"gorm.io/gorm"
)

type ArticleController struct {
	articleService    services.ArticleService
	articleRepository repositories.ArticleRepository
}

func NewArticleController() *ArticleController {
	return &ArticleController{
		articleService:    services.GetArticleService(),
		articleRepository: repositories.GetArticleRepository(),
	}
}

func (c *ArticleController) Route(e *echo.Echo) {
	e.POST("/apis/articles", http.Provide(c.CreateArticleByURL))
	e.GET("/apis/articles/:id", http.Provide(c.GetArticle))
	e.PUT("/apis/articles/:id/title", http.Provide(c.UpdateTitle))
	e.PUT("/apis/articles/:id/tags", http.Provide(c.UpdateTags))
	e.PUT("/apis/articles/:id/content", http.Provide(c.UpdateContent))
	e.GET("/apis/articles/tags/:tag", http.Provide(c.FindArticlesByTag))
	e.GET("/apis/articles/search", http.Provide(c.SearchArticle))
	e.DELETE("/apis/articles/:id", http.Provide(c.DeleteArticle))
}

func (c *ArticleController) CreateArticleByURL(ctx http.ContextExtended) error {
	var req reqres.CreateArticleByURLRequest
	if err := ctx.Bind(&req); err != nil {
		return ctx.BadRequestf("invalid request body: %s", err.Error())
	} else if err = req.Validate(); err != nil {
		return ctx.BadRequestf("invalid request body: %s", err.Error())
	}

	article, err := c.articleService.CreateByURL(req.URL, req.Tags)
	if err != nil {
		return ctx.InternalServerError(err, "failed to create article by url")
	}

	return ctx.Success(reqres.ArticleResponse{
		OK:      true,
		Article: article,
	})
}

func (c *ArticleController) GetArticle(ctx http.ContextExtended) error {
	id, err := ctx.ParamInt64("id")
	if err != nil {
		return ctx.BadRequest("invalid id")
	}

	article, err := c.articleRepository.GetByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return ctx.NotFoundf("failed to get article: %s", err.Error())
		}
		return ctx.InternalServerError(err, "failed to get article")
	}

	return ctx.Success(reqres.ArticleResponse{
		OK:      true,
		Article: article,
	})
}

func (c *ArticleController) UpdateTitle(ctx http.ContextExtended) error {
	id, err := ctx.ParamInt64("id")
	if err != nil {
		return ctx.BadRequest("invalid id")
	}

	var req reqres.UpdateTitleRequest
	if err := ctx.Bind(&req); err != nil {
		return ctx.BadRequestf("invalid request body: %s", err.Error())
	}

	if err := c.articleService.UpdateTitle(id, req.Title); err != nil {
		return ctx.InternalServerError(err, "failed to update title")
	}

	return ctx.Success(http.SuccessResponse{OK: true})
}

func (c *ArticleController) UpdateTags(ctx http.ContextExtended) error {
	id, err := ctx.ParamInt64("id")
	if err != nil {
		return ctx.BadRequest("invalid id")
	}

	var req reqres.UpdateTagsRequest
	if err := ctx.Bind(&req); err != nil {
		return ctx.BadRequestf("invalid request body: %s", err.Error())
	} else if err = req.Validate(); err != nil {
		return ctx.BadRequestf("invalid request body: %s", err.Error())
	}

	if err := c.articleService.UpdateTags(id, req.Tags); err != nil {
		return ctx.InternalServerError(err, "failed to update tags")
	}

	return ctx.Success(http.SuccessResponse{OK: true})
}

func (c *ArticleController) UpdateContent(ctx http.ContextExtended) error {
	id, err := ctx.ParamInt64("id")
	if err != nil {
		return ctx.BadRequest("invalid id")
	}

	var req reqres.UpdateContentRequest
	if err := ctx.Bind(&req); err != nil {
		return ctx.BadRequestf("invalid request body: %s", err.Error())
	}

	if err := c.articleService.UpdateContent(id, req.Content); err != nil {
		return ctx.InternalServerError(err, "failed to update content")
	}

	return ctx.Success(http.SuccessResponse{OK: true})
}

func (c *ArticleController) FindArticlesByTag(ctx http.ContextExtended) error {
	tag := ctx.ParamStr("tag")
	page, offset, limit := ctx.PageOffsetLimit()

	var articles []*models.Article
	var cnt int64
	var err error

	if tag == "untagged" {
		articles, cnt, err = c.articleRepository.FindUntaggedWithPage(offset, limit)
		if err != nil {
			return ctx.InternalServerError(err, "failed to find untagged articles")
		}
	} else if tag == "all" {
		articles, cnt, err = c.articleRepository.FindAllWithPage(offset, limit)
		if err != nil {
			return ctx.InternalServerError(err, "failed to find all articles")
		}
	} else {
		articles, cnt, err = c.articleRepository.FindByTagWithPage(tag, offset, limit)
		if err != nil {
			return ctx.InternalServerError(err, "failed to find articles by tag")
		}
	}

	return ctx.Success(reqres.ArticlesResponse{
		OK:         true,
		Articles:   articles,
		Pagination: http.NewPagination(page, cnt),
	})
}

func (c *ArticleController) SearchArticle(ctx http.ContextExtended) error {
	keyword := ctx.QueryParamStr("q")
	if len(keyword) <= 1 {
		return ctx.BadRequest("keyword should be more than 2 characters")
	}
	page, offset, limit := ctx.PageOffsetLimit()

	articles, cnt, err := c.articleService.Search(keyword, offset, limit)
	if err != nil {
		return ctx.InternalServerError(err, "failed to search")
	}

	return ctx.Success(reqres.ArticlesResponse{
		OK:         true,
		Articles:   articles,
		Pagination: http.NewPagination(page, cnt),
	})
}

func (c *ArticleController) DeleteArticle(ctx http.ContextExtended) error {
	id, err := ctx.ParamInt64("id")
	if err != nil {
		return ctx.BadRequest("invalid id")
	}

	if err := c.articleService.Delete(id); err != nil {
		return ctx.InternalServerError(err, "failed to delete article")
	}

	return ctx.Success(http.SuccessResponse{OK: true})
}
