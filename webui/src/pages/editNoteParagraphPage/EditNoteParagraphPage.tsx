import React, { FC, useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import { Alert } from "rsuite"
import SimpleLayout from "../../component/layout/SimpleLayout"
import TitleInput from "../../component/note/TitleInput"
import { requestEditParagraph, requestGetNote } from "../../apis/NoteApi"
import NoteEditor from "../../component/note/editor/NoteEditor"
import Article from "../../models/Article"


const EditNoteParagraphPage: FC = () => {
  const params = useParams() as any
  const [noteID, paragraphID] = [parseInt(params.id, 10), parseInt(params.paragraphID, 10)]
  const [loadFetching, title, content, referencedArticles, referencedWebURLs] = useRequestGetNote(noteID, paragraphID)
  const [submitFetching, submit] = useSubmit(noteID, paragraphID)

  return (
    <SimpleLayout loading={loadFetching} size="lg">
      <TitleInput disabled value={title}/>
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

const useRequestGetNote = (noteID: number, paragraphID: number): [boolean, string, string, Article[], string[]] => {
  const [fetching, setFetching] = useState(false)
  const [title, setTitle] = useState('...')
  const [content, setContent] = useState('')
  const [referencedArticles, setReferencedArticles] = useState([] as Article[])
  const [referencedWebURLs, setReferencedWebURLs] = useState([] as string[])
  const history = useHistory()

  useEffect(() => {
    setFetching(true)
    requestGetNote(noteID)
      .then(([note, articles]) => {
        setTitle(note.title)

        const paragraph = note.paragraphs.find(p => p.id === paragraphID)
        if (!paragraph) {
          Alert.error('invalid paragraph id')
          setTimeout(() => history.goBack(), 3000)
          return
        }

        const referencedArticleIDs = paragraph.referenceArticles.map(a => a.articleID)
        const referencedWebURLs = paragraph.referenceWebs.map(w => w.url)
        const referencedArticles = articles.filter(a => referencedArticleIDs.includes(a.id))

        setContent(paragraph.content)
        setReferencedArticles(referencedArticles)
        setReferencedWebURLs(referencedWebURLs)
      })
      .catch(err => Alert.error(err.toString()))
      .finally(() => setFetching(false))
  }, [noteID, paragraphID, history])

  return [fetching, title, content, referencedArticles, referencedWebURLs]
}

const useSubmit = (noteID: number, paragraphID: number): [
  boolean,
  (content: string, referencedArticles: Article[], referencedWebURLs: string[]) => void,
] => {
  const [fetching, setFetching] = useState(false)
  const history = useHistory()

  const submit = (content: string, referencedArticles: Article[], referenceWebURLs: string[]) => {
    if (content.trim().length === 0) {
      Alert.error('content required')
      return
    }

    setFetching(true)
    const articleIDs = referencedArticles.map(a => a.id)
    requestEditParagraph(noteID, paragraphID, content, articleIDs, referenceWebURLs)
      .then(() => history.push(`/notes/${noteID}`))
      .catch(err => {
        Alert.error(err.toString())
        setFetching(false)
      })
  }
  return [fetching, submit]
}

export default EditNoteParagraphPage
