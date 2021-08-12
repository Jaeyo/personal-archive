import Note from "../models/Note"
import { useDelete, useGet, usePost, usePut } from "./index"
import Article from "../models/Article"
import { AxiosError } from "axios"
import { useCallback, useState } from "react"


export const useRequestGetNote = (): [
  boolean,
  (id: number) => Promise<void>,
  Note | null,
  Article[],
    AxiosError | null,
  (note: Note) => void,
] => {
  const [fetching, fetchGet, error] = useGet()
  const [note, setNote] = useState(null as Note | null)
  const [referencedArticles, setArticles] = useState([] as Article[])

  const getNote = (id: number): Promise<void> =>
    fetchGet(`/apis/notes/${id}`, resp => {
      setNote(resp.data.note)
      setArticles(resp.data.referencedArticleMetas)
    })

  return [fetching, useCallback(getNote, [fetchGet]), note, referencedArticles, error, setNote]
}

export const useRequestUpdateTitle = (): [
  boolean,
  (id: number, title: string) => Promise<void>,
    AxiosError | null,
] => {
  const [fetching, fetchPut, error] = usePut()

  const updateTitle = (id: number, title: string) =>
    fetchPut(`/apis/notes/${id}/title`, {title})

  return [fetching, useCallback(updateTitle, [fetchPut]), error]
}

export const useRequestCreateNote = (): [
  boolean,
  (title: string, content: string, referencedArticleIDs: number[], referencedWebURLs: string[]) => Promise<void>,
  Note,
    AxiosError | null,
] => {
  const [fetching, fetchPost, error] = usePost()
  const [note, setNote] = useState({} as Note)

  const createNote = (title: string, content: string, referencedArticleIDs: number[], referencedWebURLs: string[]): Promise<void> =>
    fetchPost(`/apis/notes`, {title, content, referencedArticleIDs, referencedWebURLs}, resp => {
      setNote(resp.data.note)
    })

  return [fetching, useCallback(createNote, [fetchPost]), note, error]
}

export const useRequestCreateParagraph = (): [
  boolean,
  (id: number, content: string, referenceArticleIDs: number[], referenceWebURLs: string[]) => Promise<void>,
  Note,
  AxiosError | null,
] => {
  const [fetching, fetchPost, error] = usePost()
  const [note, setNote] = useState({} as Note)

  const createParagraph = (id: number, content: string, referenceArticleIDs: number[], referenceWebURLs: string[]): Promise<void> =>
    fetchPost(`/apis/notes/${id}/paragraphs`, {content, referenceArticleIDs, referenceWebURLs}, resp => {
      setNote(resp.data.note)
    })

  return [fetching, useCallback(createParagraph, [fetchPost]), note, error]
}

export const useRequestFindNoteTitles = (): [
  boolean,
  () => Promise<void>,
  Note[],
  AxiosError | null,
] => {
  const [fetching, fetchGet, error] = useGet()
  const [notes, setNotes] = useState([] as Note[])

  const findNoteTitles = (): Promise<void> =>
    fetchGet(`/apis/notes/title`, resp => {
      setNotes(resp.data.notes)
    })

  return [fetching, useCallback(findNoteTitles, [fetchGet]), notes, error]
}

export const useRequestDeleteNote = (): [
  boolean,
  (id: number) => Promise<void>,
  AxiosError | null,
] => {
  const [fetching, fetchDelete, error] = useDelete()

  const deleteNote = (id: number): Promise<void> =>
    fetchDelete(`/apis/notes/${id}`)

  return [fetching, useCallback(deleteNote, [fetchDelete]), error]
}

export const useRequestDeleteParagraph = (): [
  boolean,
  (id: number, noteID: number) => Promise<void>,
    AxiosError | null,
] => {
  const [fetching, fetchDelete, error] = useDelete()

  const deleteParagraph = (noteID: number, id: number) =>
    fetchDelete(`/apis/notes/${noteID}/paragraphs/${id}`)

  return [fetching, useCallback(deleteParagraph, [fetchDelete]), error]
}

export const useRequestSwapParagraphs = (): [
  boolean,
  (noteID: number, aID: number, bID: number) => Promise<void>,
    AxiosError | null,
] => {
  const [fetching, fetchPut, error] = usePut()

  const swapParagraphs = (noteID: number, aID: number, bID: number): Promise<void> =>
    fetchPut(`/apis/notes/${noteID}/paragraphs/swap`, {aID, bID})

  return [fetching, useCallback(swapParagraphs, [fetchPut]), error]
}

export const useRequestEditParagraph = (): [
  boolean,
  (noteID: number, paragraphID: number, content: string, referenceArticleIDs: number[], referenceWebURLs: string[]) => Promise<void>,
    AxiosError | null,
] => {
  const [fetching, fetchPut, error] = usePut()

  const editParagraph = (noteID: number, paragraphID: number, content: string, referenceArticleIDs: number[], referenceWebURLs: string[]): Promise<void> =>
    fetchPut(`/apis/notes/${noteID}/paragraphs/${paragraphID}`, {content, referenceArticleIDs, referenceWebURLs})

  return [fetching, useCallback(editParagraph, [fetchPut]), error]
}
