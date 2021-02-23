import React, { FC, useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import { Alert } from "rsuite"
import SimpleLayout from "../../component/layout/SimpleLayout"
import TitleInput from "../../component/note/TitleInput"
import { requestCreateParagraph, requestGetNote } from "../../apis/NoteApi"
import NoteEditor from "../../component/note/editor/NoteEditor"
import Article from "../../models/Article"


const NewNoteParagraphPage: FC = () => {
  const {id: noteID} = useParams() as any
  const [loadFetching, title] = useRequestGetNote(noteID)
  const [submitFetching, submit] = useSubmit(noteID)

  return (
    <SimpleLayout loading={loadFetching} size="lg">
      <TitleInput disabled value={title}/>
      <NoteEditor
        content=""
        referenceArticles={[]}
        referenceWebURLs={[]}
        onSubmit={submit}
        fetching={submitFetching}
      />
    </SimpleLayout>
  )
}

const useRequestGetNote = (noteID: number): [boolean, string] => {
  const [fetching, setFetching] = useState(false)
  const [title, setTitle] = useState('...')
  const history = useHistory()

  useEffect(() => {
    setFetching(true)
    requestGetNote(noteID)
      .then(([note, articles]) => {
        setTitle(note.title)
      })
      .catch(err => Alert.error(err.toString()))
      .finally(() => setFetching(false))
  }, [noteID])

  return [fetching, title]
}

const useSubmit = (noteID: number): [
  boolean,
  (content: string, referencedArticles: Article[], referenceWebURLs: string[]) => void,
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
    requestCreateParagraph(noteID, content, articleIDs, referenceWebURLs)
      .then(() => history.push(`/notes/${noteID}`))
      .catch(err => {
        Alert.error(err.toString())
        setFetching(false)
      })
  }

  return [fetching, submit]
}

export default NewNoteParagraphPage
