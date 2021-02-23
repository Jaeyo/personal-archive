import React, { FC, useState } from "react"
import { Alert } from "rsuite"
import { useHistory } from "react-router-dom"
import Article from "../../models/Article"
import { requestCreateNote } from "../../apis/NoteApi"
import NoteEditor from "../../component/note/editor/NoteEditor"
import SimpleLayout from "../../component/layout/SimpleLayout"
import TitleInput from "../../component/note/TitleInput"


const NewNotePage: FC = () => {
  const [title, setTitle] = useState('')
  const [ fetching, submit ] = useSubmit()

  const onSubmit = (content: string, referenceArticles: Article[], referenceWebURLs: string[]) =>
    submit(title, content, referenceArticles, referenceWebURLs)

  return (
    <SimpleLayout size="lg">
      <TitleInput value={title} onChange={setTitle} placeholder="Title"/>
      <NoteEditor
        content=""
        referenceArticles={[]}
        referenceWebURLs={[]}
        onSubmit={onSubmit}
        fetching={fetching}
      />
    </SimpleLayout>
  )
}

const useSubmit = (): [
  boolean,
  (title: string, content: string, referenceArticles: Article[], referenceWebURLs: string[]) => void,
] => {
  const [fetching, setFetching] = useState(false)
  const history = useHistory()

  const submit = (title: string, content: string, referenceArticles: Article[], referenceWebURLs: string[]) => {
    if (title.trim().length === 0) {
      Alert.error('title required')
      return
    }

    if (content.trim().length === 0) {
      Alert.error('content required')
      return
    }

    setFetching(true)
    const articleIDs = referenceArticles.map(({id}) => id)
    requestCreateNote(title, content, articleIDs, referenceWebURLs)
      .then(note => history.push(`/notes/${note.id}`))
      .catch(err => {
        Alert.error(err.toString())
        setFetching(false)
      })
  }

  return [ fetching, submit ]
}

export default NewNotePage
