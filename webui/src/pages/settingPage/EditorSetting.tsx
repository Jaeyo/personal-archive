import React, { FC, useEffect, useState } from "react"
import { useRequestGetEditorKeyboardHandler, useRequestSetEditorKeyboardHandler } from "../../apis/SettingApi"
import { Select, List, ListItem, Loading } from "@kiwicom/orbit-components"


const EditorSetting: FC = () => {
  const [fetching, getEditorKeyboardHandler, keyboardHandlerOnServer] = useRequestGetEditorKeyboardHandler()
  const [_, submitEditorKeyboardHandler] = useRequestSetEditorKeyboardHandler()
  const [keyboardHandler, setKeyboardHandler] = useState('')

  useEffect(() => {
    getEditorKeyboardHandler()
      .then(() => setKeyboardHandler(keyboardHandlerOnServer))
  }, [getEditorKeyboardHandler, keyboardHandlerOnServer])

  const onSubmit = (keyboardHandler: string) => {
    setKeyboardHandler(keyboardHandler)
    submitEditorKeyboardHandler(keyboardHandler)
  }

  if (fetching) {
    return <Loading type="boxLoader" />
  }

  return (
    <List type="primary">
      <ListItem label="keyboard handler">
        <Select
          options={[
            { label: 'vim', value: 'vim' },
            { label: 'simple', value: 'windows' },
          ]}
          size="small"
          value={keyboardHandler}
          onChange={e => onSubmit((e.target as any).value)}
        />
      </ListItem>
    </List>
  )
}

export default EditorSetting
