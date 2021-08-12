import React, { FC, useEffect, useState } from "react"
import styled from "styled-components"
import { useRequestUpdateTag } from "../../apis/ArticleTagApi"
import { VisibleProps } from "../../common/Props"
import { Button, InputField } from "@kiwicom/orbit-components"
import { Edit } from "@kiwicom/orbit-components/icons"
import Title from "../../component/common/Title"


interface Props {
  tag: string
}

const TagTitle: FC<Props> = ({tag: initialTag}) => {
  const [isEditMode, setEditMode] = useState(false)
  const [tag, setTag] = useState('')
  const [fetching, updateTag] = useRequestUpdateTag()

  useEffect(() => {
    setTag(initialTag)
  }, [initialTag])

  const onSubmit = () => {
    updateTag(initialTag, tag)
      .then(() => {
        window.location.href = `/tags/${encodeURIComponent(tag)}`
      })
  }

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
