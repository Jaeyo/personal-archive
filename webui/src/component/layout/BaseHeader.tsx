import React, { FC, useState } from "react"
import styled from "styled-components"
import { Alert, Icon, Input, InputGroup } from "rsuite"
import { useHistory } from "react-router-dom"


const BaseHeader: FC = () => {
  const [keyword, setKeyword] = useState('')
  const history = useHistory()

  const onSearch = () => {
    if (keyword.length <= 1) {
      Alert.error('keyword should be more than 2 characters')
      return
    }

    history.push(`/articles/search?q=${encodeURIComponent(keyword)}&page=1`)
  }

  return (
    <Wrapper>
      <KeywordInputGroup>
        <Input
          value={keyword}
          onChange={setKeyword}
          onPressEnter={onSearch}
        />
        <InputGroup.Button onClick={onSearch}>
          <Icon icon="search"/>
        </InputGroup.Button>
      </KeywordInputGroup>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  text-align: right;
`

const KeywordInputGroup = styled(InputGroup)`
  display: inline-flex;
  width: 300px;
  margin: 10px;
`

export default BaseHeader
