package http

import (
	"math"
)

const ItemsPerPage = 20

type Pagination struct {
	Page       int `json:"page"`
	TotalPages int `json:"totalPages"`
}

func NewPagination(page int, count int64) *Pagination {
	return &Pagination{
		Page:       page,
		TotalPages: totalPagesByCount(count),
	}
}

func totalPagesByCount(count int64) int {
	return int(math.Ceil(float64(count) / float64(ItemsPerPage)))
}
