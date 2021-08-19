import React, { FC, useEffect } from "react"
import { useHistory, useParams } from "react-router-dom"
import SimpleLayout from "../../component/layout/SimpleLayout"
import { useRequestCreateParagraph, useRequestGetNote } from "../../apis/NoteApi"
import NoteEditor from "../../component/note/editor/NoteEditor"
import Article from "../../models/Article"
import { toast } from "react-hot-toast"
import { InputField } from "@kiwicom/orbit-components"
import CommandPalette from "./CommandPalette"


const NewNoteParagraphPage: FC = () => {
  const {id: noteID} = useParams() as any
  const [loadFetching, getNote, note ] = useRequestGetNote()
  const [submitFetching, submit] = useSubmit(noteID)

  useEffect(() => {
    getNote(noteID)
  }, [ noteID, getNote ])

  return (
    <SimpleLayout loading={loadFetching}>
      <InputField disabled value={note?.title || ''}/>
      <NoteEditor
        content=""
        referenceArticles={[]}
        referenceWebURLs={[]}
        onSubmit={submit}
        fetching={submitFetching}
      />
      <CommandPalette />
    </SimpleLayout>
  )
}

const useSubmit = (noteID: number): [
  boolean,
  (content: string, referencedArticles: Article[], referenceWebURLs: string[]) => void,
] => {
  const [fetching, createParagraph] = useRequestCreateParagraph()
  const history = useHistory()

  const submit = (content: string, referencedArticles: Article[], referenceWebURLs: string[]) => {
    if (content.trim().length === 0) {
      toast.error('content required')
      return
    }

    const articleIDs = referencedArticles.map(a => a.id)
    createParagraph(noteID, content, articleIDs, referenceWebURLs)
      .then(note => history.push(`/notes/${noteID}`))
  }

  return [fetching, submit]
}

export default NewNoteParagraphPage
