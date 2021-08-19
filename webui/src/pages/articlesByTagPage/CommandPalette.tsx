import React, { FC } from "react"
import BaseCommandPalette from "../../component/etc/BaseCommandPalette"
import { useHistory } from "react-router-dom"
import { prompt } from "../../component/etc/GlobalPrompt"
import { useRequestUpdateTag } from "../../apis/ArticleTagApi"


interface Props {
  tag: string
  onReload: (newTag?: string) => void
}

const CommandPalette: FC<Props> = ({tag, onReload}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, updateTag] = useRequestUpdateTag()
  const history = useHistory()

  const onEdit = () =>
    prompt({
      message: 'edit tag',
      initialValue: tag,
      onOK: (newTag: string) =>
        updateTag(tag, newTag)
          .then(() => onReload())
    })

  const goToPage = () => {
    prompt({
      message: 'go to page',
      inputType: 'number',
      onOK: async (page: string) =>
        history.push(`/tags/${encodeURIComponent(tag)}?page=${page}`)
    })
  }

  return (
    <BaseCommandPalette
      commands={[
        {name: 'edit tag', command: () => onEdit(), visible: tag !== 'untagged' && tag !== 'all'},
        {name: 'go to page', command: () => goToPage()},
      ]}
    />
  )
}

export default CommandPalette
