import React, { FC, useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import { Alert } from "rsuite"
import SimpleLayout from "../../component/layout/SimpleLayout"
import TitleInput from "../../component/note/TitleInput"
import { requestCreateParagraph, requestGetNote } from "../../apis/NoteApi"
import NoteEditor from "../../component/note/editor/NoteEditor"
import Article from "../../models/Article"


const NewNoteParagraphPage: FC = () => {
  const { id: noteID } = useParams() as any
  const [ fetching, setFetching ] = useState(false)
  const [ title, setTitle ] = useState('...')
  const history = useHistory()

  useEffect(() => {
    setFetching(true)
    requestGetNote(noteID)
      .then(([ note, articles ]) => {
        setTitle(note.title)
      })
      .catch(err => Alert.error(err.toString()))
      .finally(() => setFetching(false))
  }, [ noteID ])

  const onSubmit = (content: string, referencedArticles: Article[], referenceWebURLs: string[]) => {
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

  return (
    <SimpleLayout loading={fetching} size="lg">
      <TitleInput disabled value={title} />
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

export default NewNoteParagraphPage
