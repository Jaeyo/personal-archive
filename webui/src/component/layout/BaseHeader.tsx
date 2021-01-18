import React, { FC, useState } from "react"
import styled from "styled-components"
import { Link, useHistory } from "react-router-dom"
import { Alert, Icon, Input, InputGroup } from "rsuite"


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
      <Link to="/">
        <Logo>
          <LogoIcon icon="inbox" />
          PERSONAL ARCHIVE
        </Logo>
      </Link>
      <RightAlignDiv>
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
        <Link to="/settings">
          <SettingIcon icon="cog" />
        </Link>
      </RightAlignDiv>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  margin-top: 15px;
  margin-bottom: 15px;
`

const Logo = styled.h1`
  color: #777;
  display: inline;
  font-size: 18px;
  border-bottom: 1px dashed #bbb;
  padding: 0 3px 9px 3px;
  margin-left: 30px;
`

const LogoIcon = styled(Icon)`
  color: #777;
  font-size: 18px;
  margin-right: 10px;
`

const RightAlignDiv = styled.div`
  float: right;
  padding-top: 10px;
  padding-right: 20px;
  display: flex;
  flex-direction: row;
`

const SettingIcon = styled(Icon)`
  color: #777;
  font-size: 20px;
  margin-top: 18px;
  margin-left: 20px;
`

const KeywordInputGroup = styled(InputGroup)`
  display: inline-flex;
  width: 300px;
  margin: 10px;
`

export default BaseHeader
