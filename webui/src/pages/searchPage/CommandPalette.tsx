import React, { FC } from "react"
import BaseCommandPalette from "../../component/etc/BaseCommandPalette"
import { prompt } from "../../component/etc/GlobalPrompt"
import { useHistory } from "react-router-dom"


interface Props {
  keyword: string
  page: number
}

const CommandPalette: FC<Props> = ({keyword, page}) => {
  const history = useHistory()

  const onEditKeyword = () =>
    prompt({
      message: 'keyword',
      initialValue: keyword,
      onOK: async (newKeyword: string) =>
        history.push(`/articles/search?q=${encodeURIComponent(newKeyword)}&page=1`)
    })

  const goToPage = () =>
    prompt({
      message: 'go to page',
      inputType: 'number',
      initialValue: page + '',
      onOK: async (newPage: string) =>
        history.push(`/articles/search?q=${encodeURIComponent(keyword)}&page=${newPage}`)
    })

  return (
    <BaseCommandPalette
      commands={[
        {name: 'edit keyword', command: () => onEditKeyword()},
        {name: 'go to page', command: () => goToPage()},
      ]}
    />
  )
}

export default CommandPalette
