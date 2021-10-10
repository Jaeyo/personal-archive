package controllers

import "github.com/labstack/echo/v4"

type Controller interface {
	Route(e *echo.Echo)
}
