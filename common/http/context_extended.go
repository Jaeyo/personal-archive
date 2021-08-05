package http

import (
	"fmt"
	"github.com/labstack/echo/v4"
	"net/http"
	"net/url"
	"strconv"
	"strings"
)

type ContextExtended struct {
	echo.Context
}

func (c ContextExtended) ParamInt64(name string) (int64, error) {
	return strconv.ParseInt(c.ParamStr(name), 10, 64)
}

func (c ContextExtended) ParamStr(name string) string {
	return decodeUriComponent(c.Param(name))
}

func (c ContextExtended) QueryParamStr(name string) string {
	return decodeUriComponent(c.QueryParam(name))
}

func (c ContextExtended) QueryParamInt(name string) (int, error) {
	return strconv.Atoi(c.QueryParamStr(name))
}

func (c ContextExtended) QueryParamInt64SliceWithComma(name string) ([]int64, error) {
	splited := strings.Split(c.QueryParamStr(name), ",")
	slice := []int64{}
	for _, value := range splited {
		intValue, err := strconv.ParseInt(value, 10, 64)
		if err != nil {
			return nil, err
		}
		slice = append(slice, intValue)
	}
	return slice, nil
}

func (c ContextExtended) Page() int {
	page, err := c.QueryParamInt("page")
	if err != nil || page <= 0 {
		return 1
	}
	return page
}

func (c ContextExtended) PageOffsetLimit() (int, int, int) {
	page := c.Page()
	offset := (page - 1) * ItemsPerPage
	limit := ItemsPerPage
	return page, offset, limit
}

func (c ContextExtended) Success(data interface{}) error {
	return c.JSON(http.StatusOK, data)
}

func (c ContextExtended) InternalServerError(err error, message string) *echo.HTTPError {
	return &echo.HTTPError{
		Code:     http.StatusInternalServerError,
		Message:  message,
		Internal: err,
	}
}

func (c ContextExtended) BadRequest(message string) *echo.HTTPError {
	return &echo.HTTPError{
		Code:    http.StatusBadRequest,
		Message: message,
	}
}

func (c ContextExtended) BadRequestf(format string, a ...interface{}) *echo.HTTPError {
	return c.BadRequest(fmt.Sprintf(format, a...))
}

func (c ContextExtended) NotFound(message string) *echo.HTTPError {
	return &echo.HTTPError{
		Code:    http.StatusNotFound,
		Message: message,
	}
}

func (c ContextExtended) NotFoundf(format string, a ...interface{}) *echo.HTTPError {
	return c.NotFound(fmt.Sprintf(format, a...))
}

func Provide(fn func(ContextExtended) error) func(ctx echo.Context) error {
	return func(ctx echo.Context) error {
		return fn(ContextExtended{ctx})
	}
}

func decodeUriComponent(input string) string {
	decoded, err := url.QueryUnescape(input)
	if err != nil {
		return input
	}
	return decoded
}
