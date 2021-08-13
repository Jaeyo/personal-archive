import React, { FC, useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import SimpleLayout from "../../component/layout/SimpleLayout"
import { useRequestEditParagraph, useRequestGetNote } from "../../apis/NoteApi"
import NoteEditor from "../../component/note/editor/NoteEditor"
import Article from "../../models/Article"
import { toast } from "react-hot-toast"
import { InputField } from "@kiwicom/orbit-components"
import Note from "../../models/Note"


const EditNoteParagraphPage: FC = () => {
  const params = useParams() as any
  const [noteID, paragraphID] = [parseInt(params.id, 10), parseInt(params.paragraphID, 10)]
  const [fetching, note, content, referencedArticles, referencedWebURLs] = useNoteAndParagraph(noteID, paragraphID)
  const [submitFetching, submit] = useSubmit(noteID, paragraphID)

  const title = note ? note.title : ''

  return (
    <SimpleLayout loading={fetching}>
      <InputField disabled value={title}/>
      <NoteEditor
        content={content}
        referenceArticles={referencedArticles}
        referenceWebURLs={referencedWebURLs}
        onSubmit={submit}
        fetching={submitFetching}
      />
    </SimpleLayout>
  )
}

const useNoteAndParagraph = (noteID: number, paragraphID: number): [
  boolean,
  Note | null,
  string,
  Article[],
  string[],
] => {
  const [fetching, getNote, note, articles] = useRequestGetNote()
  const [content, setContent] = useState('')
  const [referencedArticles, setReferencedArticles] = useState([] as Article[])
  const [referencedWebURLs, setReferencedWebURLs] = useState([] as string[])
  const history = useHistory()

  useEffect(() => {
    getNote(noteID)
  }, [getNote, noteID])

  useEffect(() => {
    if (!note) {
      return
    }

    const paragraph = note!.paragraphs.find(p => p.id === paragraphID)
    if (!paragraph) {
      toast.error('invalid paragraph id')
      setTimeout(() => history.goBack(), 3000)
      return
    }

    const referencedArticleIDs = paragraph.referenceArticles.map(a => a.articleID)
    const referencedWebURLs = paragraph.referenceWebs.map(w => w.url)
    const referencedArticles = articles.filter(a => referencedArticleIDs.includes(a.id))

    setContent(paragraph.content)
    setReferencedArticles(referencedArticles)
    setReferencedWebURLs(referencedWebURLs)
  }, [note, articles, history, paragraphID])

  return [fetching, note, content, referencedArticles, referencedWebURLs]
}

const useSubmit = (noteID: number, paragraphID: number): [
  boolean,
  (content: string, referencedArticles: Article[], referencedWebURLs: string[]) => void,
] => {
  const [fetching, editParagraph] = useRequestEditParagraph()
  const history = useHistory()

  const submit = (content: string, referencedArticles: Article[], referenceWebURLs: string[]) => {
    if (content.trim().length === 0) {
      toast.error('content required')
      return
    }

    const articleIDs = referencedArticles.map(a => a.id)
    editParagraph(noteID, paragraphID, content, articleIDs, referenceWebURLs)
      .then(() => history.push(`/notes/${noteID}`))
  }
  return [fetching, submit]
}

export default EditNoteParagraphPage
