export interface Pagination {
  page: number
  totalPages: number
}

export const emptyPagination: Pagination = { page: 1, totalPages: 0 }
