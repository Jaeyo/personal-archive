package reqres

import "time"

type GetPocketRequestTokenRequest struct {
	ConsumerKey string `json:"consumerKey" validate:"required"`
	RedirectURI string `json:"redirectURI" validate:"required"`
}

type PocketRequestTokenResponse struct {
	OK           bool   `json:"ok"`
	RequestToken string `json:"requestToken"`
}

type GetPocketAuthResponse struct {
	OK              bool       `json:"ok"`
	IsAuthenticated bool       `json:"isAuthenticated"`
	Username        string     `json:"username"`
	IsSyncOn        bool       `json:"isSyncOn"`
	LastSyncTime    *time.Time `json:"lastSyncTime"`
}

type PocketSyncRequest struct {
	IsSyncOn bool `json:"isSyncOn"`
}

type PocketAuthResponse struct {
	OK        bool `json:"ok"`
	IsAllowed bool `json:"isAllowed"`
}

type EditorKeyboardHandlerRequest struct {
	KeyboardHandler string `json:"keyboardHandler"`
}

type EditorKeyboardHandlerResponse struct {
	OK              bool   `json:"ok"`
	KeyboardHandler string `json:"keyboardHandler"`
}
