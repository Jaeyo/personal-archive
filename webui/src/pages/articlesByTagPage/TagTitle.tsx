import React, { FC, useEffect, useState } from "react"
import styled from "styled-components"
import { useRequestUpdateTag } from "../../apis/ArticleTagApi"
import { VisibleProps } from "../../common/Props"
import { Button, InputField } from "@kiwicom/orbit-components"
import { ChevronDown } from "@kiwicom/orbit-components/icons"
import Title from "../../component/common/Title"
import Confirm from "../../component/common/Confirm"


interface Props {
  tag: string
}

const TagTitle: FC<Props> = ({tag: initialTag}) => {
  const [isEditPromptOpened, setEditPromptOpened] = useState(false)

  return (
    <Wrapper>
      <Title>Tag: {initialTag}</Title>
      <EditButtonWrapper $visible={initialTag !== 'untagged' && initialTag !== 'all'}>
        <Button
          iconLeft={<ChevronDown/>}
          type="white"
          size="small"
          onClick={() => setEditPromptOpened(true)}
        />
      </EditButtonWrapper>
      <EditPrompt
        isOpened={isEditPromptOpened}
        onClose={() => setEditPromptOpened(false)}
        defaultTitle={initialTag}
      />
    </Wrapper>
  )
}

const EditPrompt: FC<{
  isOpened: boolean,
  onClose: () => void,
  defaultTitle: string,
}> = ({isOpened, onClose: close, defaultTitle}) => {
  const [title, setTitle] = useState('')
  const [fetching, updateTag] = useRequestUpdateTag()

  useEffect(() => {
    setTitle(defaultTitle)
  }, [defaultTitle])

  const onSubmit = () => {
    updateTag(defaultTitle, title)
      .then(() => {
        close()
        window.location.href = `/tags/${encodeURIComponent(title)}`
      })
  }

  const onClose = () => {
    setTitle(defaultTitle)
    close()
  }

  return (
    <Confirm
      show={isOpened}
      onOK={onSubmit}
      onClose={onClose}
      loading={fetching}
    >
      <InputField
        value={title}
        onChange={e => setTitle((e.target as any).value)}
      />
    </Confirm>
  )
}

const Wrapper = styled.div`
  margin-bottom: 11px;
`

const EditButtonWrapper = styled.div<VisibleProps>`
  display: ${({$visible}) => $visible ? 'inline' : 'none'};
  margin-left: 8px;
  
  button {
    display: inline-flex;
  }
`

export default TagTitle
