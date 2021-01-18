import React from "react"
import { ArticleTagCount } from "../models/ArticleTag"


export interface TagPickerItemType {
  value: string
  label: React.ReactNode
  children?: TagPickerItemType[]
  groupBy?: string
}

export const toTagPickerItemTypes = (articleTags: ArticleTagCount[], tags: string[]): TagPickerItemType[] => {
  const values = articleTags.map(({ tag }) => tag)

  tags.forEach(tag => {
    if (!values.includes(tag)) {
      values.push(tag)
    }
  })

  return values.map(value => ({
    value,
    label: value,
  }))
}

export interface Pagination {
  page: number
  totalPages: number
}

export const emptyPagination: Pagination = { page: 1, totalPages: 0 }
