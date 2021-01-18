package reqres

type PocketAuthResponse struct {
	OK          bool   `json:"ok"`
	AppKey      string `json:"applicationKey"`
	AccessToken string `json:"accessToken"`
}

type SetPocketAuthRequest struct {
	AppKey      string `json:"applicationKey" validate:"required"`
	AccessToken string `json:"accessToken" validate:"required"`
}
