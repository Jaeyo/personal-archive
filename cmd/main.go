package main

import (
	"github.com/jaeyo/personal-archive/cmd/app"
	"github.com/jaeyo/personal-archive/common"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/sirupsen/logrus"
	"net/http"
	"os"
	"strings"
)

func main() {
	mainApp := initApp()
	mainApp.PocketSyncService.Start()

	startHttpServer(mainApp)
}

func initApp() *app.App {
	logrus.SetOutput(os.Stdout)
	logrus.SetLevel(logrus.DebugLevel)

	mainApp := app.NewApp()

	if err := mainApp.AppService.PreserveVerInfo(); err != nil {
		panic(err)
	}

	mainApp.ArticleService.Initialize()
	mainApp.NoteService.Initialize()

	return mainApp
}

var staticPages = []string{
	"/articles/*",
	"/tags/*",
	"/notes",
	"/notes/*",
	"/settings",
	"/settings/*",
	"/",
}

func startHttpServer(mainApp *app.App) {
	e := echo.New()
	e.HTTPErrorHandler = errorHandler
	e.Use(middleware.LoggerWithConfig(middleware.LoggerConfig{
		Format: "method=${method}, uri=${uri}, status=${status}\n",
	}))
	e.Use(middleware.CORS())
	e.Use(middleware.Recover())

	for _, controller := range mainApp.Controllers() {
		controller.Route(e)
	}

	routeForFrontend(e)

	if err := e.Start(":1113"); err != nil {
		if !strings.Contains(err.Error(), "Server closed") {
			panic(err)
		}
	}
}

func routeForFrontend(e *echo.Echo) {
	if common.IsLocal() {
		return
	}

	e.Static("", "/app/static")

	for _, path := range staticPages {
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
