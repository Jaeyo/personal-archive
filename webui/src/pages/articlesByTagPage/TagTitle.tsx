import React, { FC, useEffect, useState } from "react"
import styled from "styled-components"
import { requestUpdateTag } from "../../apis/ArticleTagApi"
import { VisibleProps } from "../../common/Props"
import { toast } from "react-hot-toast"
import { Button, InputField } from "@kiwicom/orbit-components"
import { Edit } from "@kiwicom/orbit-components/icons"
import Title from "../../component/common/Title"


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
          <EditButtonWrapper $visible={tag !== 'untagged' && tag !== 'all'}>
            <Button
              iconLeft={<Edit />}
              type="secondary"
              size="small"
              onClick={() => setEditMode(true)}
            />
          </EditButtonWrapper>
      </ShowDiv>
    )
  }

  return (
    <InputDiv>
      <InputField
        value={tag}
        onChange={e => setTag((e.target as any).value)}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            onSubmit()
          }
        }}
      />
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
      .then(() => window.location.href = `/tags/${encodeURIComponent(tag)}`)
      .catch(err => {
        toast.error(err.toString())
        setFetching(false)
      })
  }

  return [fetching, submit]
}

const ShowDiv = styled.div`
  margin-bottom: 11px;
`

const InputDiv = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 18px;
  margin-bottom: 18px;
`

const EditButtonWrapper = styled.div<VisibleProps>`
  display: ${({$visible}) => $visible ? 'inline' : 'none'};
  margin-left: 8px;
  
  button {
    display: inline-flex;
  }
`

export default TagTitle
