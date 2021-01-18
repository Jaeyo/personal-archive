package main

import (
	"github.com/jaeyo/personal-archive/common"
	"github.com/jaeyo/personal-archive/controllers"
	"github.com/jaeyo/personal-archive/internal"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"net/http"
	"strings"
)

func main() {
	if err := internal.GetDatabase().Init(); err != nil {
		panic(err)
	}

	e := echo.New()
	e.HTTPErrorHandler = errorHandler
	e.Use(middleware.LoggerWithConfig(middleware.LoggerConfig{
		Format: "method=${method}, uri=${uri}, status=${status}\n",
	}))
	e.Use(middleware.CORS())
	e.Use(middleware.Recover())
	routeForControllers(e)
	routeForFrontend(e)

	if err := e.Start(":1121"); err != nil {
		if !strings.Contains(err.Error(), "Server closed") {
			panic(err)
		}
	}
}

func routeForControllers(e *echo.Echo) {
	for _, controller := range []Controller{
		controllers.NewArticleController(),
		controllers.NewArticleTagController(),
	} {
		controller.Route(e)
	}
}

func routeForFrontend(e *echo.Echo) {
	if common.IsLocal() {
		return
	}

	e.Static("", "/app/static")

	pages := []string{
		"/articles/:id",
		"/tags/:tag",
	}
	for _, path := range pages {
		e.File(path, "/app/static/index.html")
	}
}

func errorHandler(err error, ctx echo.Context) {
	code := http.StatusInternalServerError
	if httpError, ok := err.(*echo.HTTPError); ok {
		code = httpError.Code
	}

	_ = ctx.JSON(code, map[string]interface{}{
		"ok":      false,
		"message": err.Error(),
	})
}

type Controller interface {
	Route(e *echo.Echo)
}
