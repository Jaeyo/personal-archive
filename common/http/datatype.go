package http

type ErrorResponse struct {
	OK      bool   `json:"ok"`
	Message string `json:"message"`
}

type SuccessResponse struct {
	OK bool `json:"ok"`
}
