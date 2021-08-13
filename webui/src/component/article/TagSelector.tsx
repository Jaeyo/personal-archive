import React, { FC } from "react"
import CreatableSelect from "react-select/creatable"
import styled from "styled-components"


interface Props {
  tags: string[]
  selectedTags: string[]
  onChange: (tags: string[]) => void
}

const TagSelector: FC<Props> = ({ tags, selectedTags, onChange }) => (
  <Selector
    isMulti
    isSearchable
    isClearable
    defaultValue={toOptionTypes(selectedTags)}
    options={toOptionTypes(tags)}
    onChange={(options: OptionType[]) => onChange(options.map(o => o.value))}
  />
)


interface OptionType {
  label: string
  value: string
}

const toOptionTypes = (tags: string[]): OptionType[] =>
  tags.map(tag => ({ label: tag, value: tag }))

const Selector = styled(CreatableSelect)`
  min-width: 300px;
`

export default TagSelector
