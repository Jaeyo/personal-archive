import React, { FC, useEffect, useRef, useState } from "react"
import { Alert } from "rsuite"
import { useHistory } from "react-router-dom"
import Article from "../../models/Article"
import { requestCreateNote } from "../../apis/NoteApi"
import NoteEditor from "../../component/note/editor/NoteEditor"
import SimpleLayout from "../../component/layout/SimpleLayout"
import TitleInput from "../../component/note/TitleInput"


const NewNotePage: FC = () => {
  const [title, setTitle] = useState('')
  const [fetching, setFetching] = useState(false)
  const history = useHistory()

  // ace editor 에서 command 로 submit 할 경우 title 의 state 가 제대로 읽히지 않음
  useEffect(() => {
    (window as any).title = title
  }, [title])

  const onSubmit = (content: string, referenceArticles: Article[], referenceWebURLs: string[]) => {
    const title = (window as any).title
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

export default NewNotePage
