import React, { FC, useState } from "react"
import { useHistory } from "react-router-dom"
import Article from "../../models/Article"
import { useRequestCreateNote } from "../../apis/NoteApi"
import NoteEditor from "../../component/note/editor/NoteEditor"
import SimpleLayout from "../../component/layout/SimpleLayout"
import { toast } from "react-hot-toast"
import { InputField } from "@kiwicom/orbit-components"


const NewNotePage: FC = () => {
  const [title, setTitle] = useState('')
  const [ fetching, submit ] = useSubmit()

  const onSubmit = (content: string, referenceArticles: Article[], referenceWebURLs: string[]) =>
    submit(title, content, referenceArticles, referenceWebURLs)

  return (
    <SimpleLayout>
      <InputField
        value={title}
        onChange={e => setTitle((e.target as any).value)}
        placeholder="Title"
      />
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
  const [fetching, createNote, note] = useRequestCreateNote()
  const history = useHistory()

  const submit = (title: string, content: string, referenceArticles: Article[], referenceWebURLs: string[]) => {
    if (title.trim().length === 0) {
      toast.error('title required')
      return
    }

    if (content.trim().length === 0) {
      toast.error('content required')
      return
    }

    const articleIDs = referenceArticles.map(({id}) => id)
    createNote(title, content, articleIDs, referenceWebURLs)
      .then(() => history.push(`/notes/${note.id}`))
  }

  return [ fetching, submit ]
}

export default NewNotePage
