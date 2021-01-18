package controllers

import (
	"github.com/jaeyo/personal-archive/common/http"
	"github.com/jaeyo/personal-archive/controllers/reqres"
	"github.com/jaeyo/personal-archive/services"
	"github.com/labstack/echo/v4"
)

type SettingController struct {
	miscService services.MiscService
}

func NewSettingController() *SettingController {
	return &SettingController{
		miscService: services.GetMiscService(),
	}
}

func (c *SettingController) Route(e *echo.Echo) {
	e.GET("/apis/settings/pocket/auth", http.Provide(c.GetPocketAuth))
	e.PUT("/apis/settings/pocket/auth", http.Provide(c.SetPocketAuth))
}

func (c *SettingController) GetPocketAuth(ctx http.ContextExtended) error {
	appKey, accessToken, err := c.miscService.GetPocketAuth()
	if err != nil {
		return ctx.InternalServerError(err, "failed to get pocket auth")
	}

	return ctx.Success(reqres.PocketAuthResponse{
		OK:          true,
		AppKey:      appKey,
		AccessToken: accessToken,
	})
}

func (c *SettingController) SetPocketAuth(ctx http.ContextExtended) error {
	var req reqres.SetPocketAuthRequest
	if err := ctx.Bind(&req); err != nil {
		return ctx.BadRequestf("invalid request body: %s", err.Error())
	}

	if err := c.miscService.SetPocketAuth(req.AppKey, req.AccessToken); err != nil {
		return ctx.InternalServerError(err, "failed to set pocket auth")
	}

	return ctx.Success(http.SuccessResponse{OK: true})
}
