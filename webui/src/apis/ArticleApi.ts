import Article from "../models/Article"
import { useDelete, useGet, usePost, usePut } from "./index"
import { emptyPagination, Pagination } from "../common/Types"
import { useCallback, useState } from "react"
import { AxiosError } from "axios"


export const useRequestCreateArticleByURL = (): [
  boolean,
  (url: string, tags: string[]) => Promise<void>,
  Article | null,
  AxiosError | null,
] => {
  const [fetching, fetchPost, error] = usePost()
  const [article, setArticle] = useState(null as Article | null)

  const createArticleByURL = (url: string, tags: string[]): Promise<void> =>
    fetchPost(`/apis/articles`, {url, tags}, resp => {
      setArticle(resp.data.articleMeta)
    })

  return [fetching, useCallback(createArticleByURL, [fetchPost]), article, error]
}

export const useRequestGetArticle = (): [
  boolean,
  (id: number) => Promise<void>,
  Article | null,
  AxiosError | null,
] => {
  const [fetching, fetchGet, error] = useGet()
  const [article, setArticle] = useState(null as Article | null)

  const getArticle = (id: number): Promise<void> =>
    fetchGet(`/apis/articles/${id}`, resp => {
      setArticle(new Article(resp.data.articleMeta))
    })

  return [fetching, useCallback(getArticle, [fetchGet]), article, error]
}

export const useRequestGetArticleContent = (): [
  boolean,
  (id: number) => Promise<void>,
  string,
  AxiosError | null,
] => {
  const [fetching, fetchGet, error] = useGet()
  const [content, setContent] = useState('')

  const getArticleContent = (id: number): Promise<void> =>
    fetchGet(`/apis/articles/${id}/content`, resp => {
      setContent(resp.data.content)
    })

  return [fetching, useCallback(getArticleContent, [fetchGet]), content, error]
}

export const useRequestUpdateTitle = (): [
  boolean,
  (id: number, title: string) => Promise<void>,
  AxiosError | null,
] => {
  const [fetching, fetchPut, error] = usePut()

  const updateTitle = (id: number, title: string): Promise<void> =>
    fetchPut(`/apis/articles/${id}/title`, {title})

  return [fetching, useCallback(updateTitle, [fetchPut]), error]
}

export const useRequestUpdateTags = (): [
  boolean,
  (id: number, tags: string[]) => Promise<void>,
    AxiosError | null,
] => {
  const [fetching, fetchPut, error] = usePut()

  const updateTags = (id: number, tags: string[]): Promise<void> =>
    fetchPut(`/apis/articles/${id}/tags`, {tags})

  return [fetching, useCallback(updateTags, [fetchPut]), error]
}

export const useRequestUpdateContent = (): [
  boolean,
  (id: number, content: string) => Promise<void>,
    AxiosError | null,
] => {
  const [fetching, fetchPut, error] = usePut()

  const updateContent = (id: number, content: string): Promise<void> =>
    fetchPut(`/apis/articles/${id}/content`, {content})

  return [fetching, useCallback(updateContent, [fetchPut]), error]
}

export const useRequestFindArticlesByTag = (): [
  boolean,
  (tag: string, page: number) => Promise<void>,
  Article[],
  Pagination,
  AxiosError | null,
] => {
  const [fetching, fetchGet, error] = useGet()
  const [articles, setArticles] = useState([] as Article[])
  const [pagination, setPagination] = useState(emptyPagination)

  const findArticlesByTag = (tag: string, page: number): Promise<void> =>
    fetchGet(`/apis/articles/tags/${encodeURIComponent(tag)}?page=${page}`, resp => {
      setArticles(resp.data.articleMetas.map((article: any) => new Article(article)))
      setPagination(resp.data.pagination)
    })

  return [fetching, useCallback(findArticlesByTag, [fetchGet]), articles, pagination, error]
}

export const useRequestSearchArticles = (): [
  boolean,
  (keyword: string, page: number) => Promise<void>,
  () => void,
  Article[],
  Pagination,
  AxiosError | null,
] => {
  const [fetching, fetchGet, error] = useGet()
  const [articles, setArticles] = useState([] as Article[])
  const [pagination, setPagination] = useState(emptyPagination)

  const searchArticles = (keyword: string, page: number): Promise<void> =>
    fetchGet(`/apis/articles/search?q=${encodeURIComponent(keyword)}&page=${page}`, resp => {
      setArticles(resp.data.articleMetas.map((article: any) => new Article(article)))
      setPagination(resp.data.pagination)
    })

  const clear = () => {
    setArticles([])
    setPagination(emptyPagination)
  }

  return [fetching, useCallback(searchArticles, [fetchGet]), clear, articles, pagination, error]
}

export const useRequestDeleteArticle = (): [
  boolean,
  (id: number) => Promise<void>,
  AxiosError | null,
] => {
  const [fetching, fetchDelete, error] = useDelete()

  const deleteArticle = (id: number): Promise<void> =>
    fetchDelete(`/apis/articles/${id}`)

  return [fetching, useCallback(deleteArticle, [fetchDelete]), error]
}

export const useRequestDeleteArticles = (): [
  boolean,
  (ids: number[]) => Promise<void>,
    AxiosError | null,
] => {
  const [fetching, fetchDelete, error] = useDelete()

  const deleteArticles = (ids: number[]): Promise<void> =>
    fetchDelete(`/apis/articles?ids=${ids.join(',')}`)

  return [fetching, useCallback(deleteArticles, [fetchDelete]), error]
}

