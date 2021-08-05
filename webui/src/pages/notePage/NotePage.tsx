import React, { FC, useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import styled from "styled-components"
import NoteTitle from "./NoteTitle"
import NoteNavLayout from "../../component/layout/NoteNavLayout"
import Note from "../../models/Note"
import { requestGetNote, requestSwapParagraphs } from "../../apis/NoteApi"
import NoteParagraph from "./NoteParagraph"
import Article from "../../models/Article"
import { toast } from "react-hot-toast"
import { Button } from "@kiwicom/orbit-components"
import { Plus } from "@kiwicom/orbit-components/icons"


const NotePage: FC = () => {
  const {id} = useParams() as any
  const history = useHistory()
  const [fetching, note, referencedArticles, swapParagraphSeq] = useRequestGetNote(id)

  return (
    <NoteNavLayout loading={fetching}>
      {note && <NoteTitle note={note}/>}
      {
        note?.paragraphs
          .sort((a, b) => a.seq - b.seq)
          .map(paragraph =>
            <NoteParagraph
              key={paragraph.id}
              paragraph={paragraph}
              referencedArticles={referencedArticles}
              onMoveUp={seq => swapParagraphSeq(seq, seq - 1)}
              onMoveDown={seq => swapParagraphSeq(seq, seq + 1)}
            />
          )
      }
      <AddButtonWrapper>
        <Button
          iconLeft={<Plus />}
          type="secondary"
          onClick={() => history.push(`/notes/${id}/paragraphs`)}
          size="small"
        />
      </AddButtonWrapper>
    </NoteNavLayout>
  )
}

const useRequestGetNote = (id: number): [
  boolean,
  Note | null,
  Article[],
  (seqA: number, seqB: number) => void,
] => {
  const [fetching, setFetching] = useState(false)
  const [note, setNote] = useState(null as Note | null)
  const [referencedArticles, setReferencedArticles] = useState([] as Article[])
  const history = useHistory()

  useEffect(() => {
    setFetching(true)
    requestGetNote(id)
      .then(([note, referencedArticles]) => {
        setNote(note)
        setReferencedArticles(referencedArticles)
      })
      .finally(() => setFetching(false))
      .catch(err => {
        toast.error(err.toString())
        if (err.response?.status === 404) {
          setTimeout(() => history.push('/'), 1000)
        }
      })
  }, [id, history])

  const swapParagraphSeq = (seqA: number, seqB: number) => {
    const swapA = note?.paragraphs.find(p => p.seq === seqA)
    const swapB = note?.paragraphs.find(p => p.seq === seqB)
    if (!swapA || !swapB) {
      return
    }

    swapA.seq = seqB
    swapB.seq = seqA
    requestSwapParagraphs(id, swapA.id, swapB.id)
      .catch(err => toast.error(err.toString()))

    setNote(Object.assign({}, note)) // refresh
  }

  return [fetching, note, referencedArticles, swapParagraphSeq]
}

const AddButtonWrapper = styled.div`
  text-align: center;
  padding: 10px 0;
  
  button {
    display: inline-flex;
  }
`

export default NotePage
