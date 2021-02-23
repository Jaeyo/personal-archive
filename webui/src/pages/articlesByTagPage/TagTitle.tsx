import React, { FC, useEffect, useState } from "react"
import styled from "styled-components"
import { Alert, Button, Icon, IconButton, Input } from "rsuite"
import { requestUpdateTag } from "../../apis/ArticleTagApi"
import { VisibleProps } from "../../common/Props"


interface Props {
  tag: string
}

const TagTitle: FC<Props> = ({tag: initialTag}) => {
  const [isEditMode, setEditMode] = useState(false)
  const [tag, setTag] = useState('')
  const [fetching, submit] = useSubmit()

  useEffect(() => {
    setTag(initialTag)
  }, [initialTag])

  const onSubmit = () => submit(initialTag, tag)

  if (!isEditMode) {
    return (
      <ShowDiv>
        <Title>Tag: {initialTag}</Title>
        <EditButton
          $visible={tag !== 'untagged'}
          icon={<Icon icon="edit"/>}
          size="xs"
          onClick={() => setEditMode(true)}
        />
      </ShowDiv>
    )
  }

  return (
    <InputDiv>
      <Input value={tag} onChange={v => setTag(v)} onPressEnter={onSubmit}/>
      <Button loading={fetching} onClick={onSubmit}>Submit</Button>
      <Button onClick={() => setEditMode(false)}>Cancel</Button>
    </InputDiv>
  )
}

const useSubmit = (): [boolean, (initialTag: string, tag: string) => void] => {
  const [fetching, setFetching] = useState(false)

  const submit = (initialTag: string, tag: string) => {
    setFetching(true)
    requestUpdateTag(initialTag, tag)
      .then(() => window.location.href = `/tags/${tag}`)
      .catch(err => {
        Alert.error(err.toString())
        setFetching(false)
      })
  }

  return [fetching, submit]
}

const ShowDiv = styled.div`
  margin-bottom: 11px;
`

const Title = styled.h1`
  display: inline;
  font-size: 24px;
  margin-right: 20px;
`

const InputDiv = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 18px;
  margin-bottom: 18px;
`

const EditButton = styled(IconButton)<VisibleProps>`
  display: ${({$visible}) => $visible ? 'inline' : 'none'}
`

export default TagTitle
