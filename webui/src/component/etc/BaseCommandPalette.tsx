import React, { FC, useState } from "react"
import ReactCommandPalette, { Command } from "react-command-palette"
import styled from "styled-components"
import Mousetrap from "mousetrap"
import { useHistory } from "react-router-dom"
import { publish, ShowSearchDrawer, ToggleDarkMode } from "../../common/EventBus"
import { useHotKeys } from "../../common/Hooks"


interface Props {
  commands: Command[]
}

const BaseCommandPalette: FC<Props> = ({ commands }) => {
  const [isOpened, setOpened] = useState(false)
  const history = useHistory()

  useHotKeys('command+shift+k', () => setOpened(!isOpened))

  return (
    <Hide>
      <ReactCommandPalette
        open={isOpened}
        commands={[
          ...commands.filter(({ visible = true }) => visible),
          { name: 'go to article', command: () => history.push('/tags/all') },
          { name: 'go to note', command: () => history.push('/notes') },
          { name: 'go to setting', command: () => history.push('/settings') },
          { name: 'go to search', command: () => publish(ShowSearchDrawer, true) },
          { name: 'toggle dark mode', command: () => publish(ToggleDarkMode) }
        ]}
        closeOnSelect
        resetInputOnOpen
        onAfterOpen={() => Mousetrap.bind('esc', () => setOpened(false))}
        onRequestClose={() => Mousetrap.unbind('esc')}
      />
    </Hide>
  )
}

const Hide = styled.div`
  display: none;
`

export default BaseCommandPalette
