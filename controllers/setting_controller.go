package controllers

import (
	"github.com/jaeyo/personal-archive/common/http"
	"github.com/jaeyo/personal-archive/controllers/reqres"
	"github.com/jaeyo/personal-archive/services"
	"github.com/labstack/echo/v4"
)

type SettingController struct {
	pocketService services.PocketService
}

func NewSettingController() *SettingController {
	return &SettingController{
		pocketService: services.GetPocketService(),
	}
}

func (c *SettingController) Route(e *echo.Echo) {
	e.POST("/apis/settings/pocket/request-token", http.Provide(c.ObtainPocketRequestToken))
	e.POST("/apis/settings/pocket/auth", http.Provide(c.Auth))
	e.POST("/apis/settings/pocket/unauth", http.Provide(c.Unauth))
	e.GET("/apis/settings/pocket/auth", http.Provide(c.GetAuth))
	e.PUT("/apis/settings/pocket/sync", http.Provide(c.ToggleSync))
}

func (c *SettingController) ObtainPocketRequestToken(ctx http.ContextExtended) error {
	var req reqres.GetPocketRequestTokenRequest
	if err := ctx.Bind(&req); err != nil {
		return ctx.BadRequestf("invalid request body: %s", err.Error())
	}

	requestToken, err := c.pocketService.ObtainRequestToken(req.ConsumerKey, req.RedirectURI)
	if err != nil {
		return ctx.InternalServerError(err, "failed to obtain request token")
	}

	return ctx.Success(reqres.PocketRequestTokenResponse{
		OK:           true,
		RequestToken: requestToken,
	})
}

func (c *SettingController) Auth(ctx http.ContextExtended) error {
	isAllowed, err := c.pocketService.Auth()
	if err != nil {
		return ctx.InternalServerError(err, "failed to authenticate pocket")
	}

	return ctx.Success(reqres.PocketAuthResponse{
		OK:        true,
		IsAllowed: isAllowed,
	})
}

func (c *SettingController) Unauth(ctx http.ContextExtended) error {
	if err := c.pocketService.Unauth(); err != nil {
		return ctx.InternalServerError(err, "failed to unauth")
	}

	return ctx.Success(http.SuccessResponse{OK: true})
}

func (c *SettingController) GetAuth(ctx http.ContextExtended) error {
	isAuthenticated, username, isSyncOn, err := c.pocketService.GetAuth()
	if err != nil {
		return ctx.InternalServerError(err, "failed to get auth")
	}

	lastSyncTime, err := c.pocketService.GetLastSyncTime()
	if err != nil {
		return ctx.InternalServerError(err, "failed to get last sync")
	}

	return ctx.Success(reqres.GetPocketAuthResponse{
		OK:              true,
		IsAuthenticated: isAuthenticated,
		Username:        username,
		IsSyncOn:        isSyncOn,
		LastSyncTime:    lastSyncTime,
	})
}

func (c *SettingController) ToggleSync(ctx http.ContextExtended) error {
	var req reqres.PocketSyncRequest
	if err := ctx.Bind(&req); err != nil {
		return ctx.BadRequestf("invalid request body: %s", err.Error())
	}

	if err := c.pocketService.ToggleSync(req.IsSyncOn); err != nil {
		return ctx.InternalServerError(err, "failed to update sync status")
	}

	return ctx.Success(http.SuccessResponse{OK: true})
}
