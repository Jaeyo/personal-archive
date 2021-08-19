import React, { FC } from "react"
import styled from "styled-components"
import { VisibleProps } from "../../common/Props"
import { Button } from "@kiwicom/orbit-components"
import { ChevronDown } from "@kiwicom/orbit-components/icons"
import Title from "../../component/common/Title"
import { useRequestUpdateTag } from "../../apis/ArticleTagApi"
import { prompt } from "../../component/etc/GlobalPrompt"


interface Props {
  tag: string
  onReload: (newTag?: string) => void
}

const TagTitle: FC<Props> = ({tag: initialTag, onReload}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, updateTag] = useRequestUpdateTag()

  const onEdit = () =>
    prompt({
      message: 'edit title',
      initialValue: initialTag,
      onOK: (newTag: string) =>
        updateTag(initialTag, newTag)
          .then(() => onReload())
    })

  return (
    <Wrapper>
      <Title>Tag: {initialTag}</Title>
      <EditButtonWrapper $visible={initialTag !== 'untagged' && initialTag !== 'all'}>
        <Button
          iconLeft={<ChevronDown/>}
          type="white"
          size="small"
          onClick={() => onEdit()}
        />
      </EditButtonWrapper>
    </Wrapper>
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
