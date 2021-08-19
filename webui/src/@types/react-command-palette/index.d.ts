declare module "react-command-palette" {
  import { ComponentType, ReactNode } from "react"

  export type Command = {
    name: string
    command: () => void
    visible?: boolean
  }

  export type Theme = {
    container?: string
    containerOpen?: string
    content?: string
    header?: string
    input?: string
    inputFocused?: string
    inputOpen?: string
    modal?: string
    overlay?: string
    spinner?: string
    suggestion?: string
    suggestionFirst?: string
    suggestionHighlighted?: string
    suggestionsContainer?: string
    suggestionsContainerOpen?: string
    suggestionsList?: string
    trigger?: string
  }

  type Props = {
    open?: boolean
    alwaysRenderCommands?: boolean
    display?: 'modal' | 'inline'
    header?: string | ComponentType
    closeOnSelect?: boolean
    resetInputOnOpen?: boolean
    placeholder?: string
    hotKeys?: string | string[]
    defaultInputValue?: string
    getSuggestionValue?: () => string
    highlightFirstSuggestion?: boolean
    options?: any
    filterSearchQuery?: (inputValue: string) => string
    onChange?: (inputValue: string, userQuery: string) => void
    onHighlight?: (suggestion: string) => void
    onSelect?: (command: string) => void
    onAfterOpen?: () => void
    onRequestClose?: () => void
    shouldReturnFocusAfterClose?: boolean
    commands: Command[]
    reactModalParentSelector?: string
    renderCommand?: ReactNode
    maxDisplayed?: number
    spinner?: string | ComponentType
    showSpinnerOnSelect?: boolean
    theme?: Theme
  }

  const ReactCommandPalette: React.ElementType<Props>

  export default ReactCommandPalette
}
