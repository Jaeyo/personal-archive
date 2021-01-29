import React, { FC, useState } from "react"
import styled from "styled-components"
import { Link, useHistory } from "react-router-dom"
import { Alert, Icon, IconButton, Input, InputGroup } from "rsuite"


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
          <LogoIcon icon="inbox"/>
          PERSONAL ARCHIVE
        </Logo>
      </Link>
      <NavLink to="/tags/all">
        <nav>Article</nav>
      </NavLink>
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
        <SettingButton
          appearance="link"
          icon={<Icon icon="cog"/>}
          onClick={() => history.push('/settings')}
        />
      </RightAlignDiv>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  margin-top: 15px;
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
`

const Logo = styled.h1`
  color: #777;
  display: inline;
  font-size: 18px;
  border-bottom: 1px dashed #bbb;
  padding: 0 3px 9px 3px;
  margin: 0 30px;
`

const NavLink = styled(Link)`
  margin: 16px 0;
  padding: 5px 20px;
  font-weight: 600;
  color: #777;
  
  :hover {
    background-color: #eee;
    color: #777;
    text-decoration: none;
  }
  :focus {
    color: #777;
    text-decoration: none;
  }
`

const LogoIcon = styled(Icon)`
  color: #777;
  font-size: 18px;
  margin-right: 10px;
`

const RightAlignDiv = styled.div`
  margin-left: auto;
  margin-right: 0;
  
  float: right;
  padding-top: 10px;
  padding-right: 20px;
  display: flex;
  flex-direction: row;
`

const KeywordInputGroup = styled(InputGroup)`
  display: inline-flex;
  width: 300px;
  height: 36px;
  margin-right: 10px;
`

const SettingButton = styled(IconButton)`
  color: gray;
`

export default BaseHeader
