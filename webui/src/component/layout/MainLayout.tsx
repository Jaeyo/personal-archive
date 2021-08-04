import React, { FC, ReactNode, useEffect, useState } from "react"
import { Drawer, Icon, Input, InputGroup } from "rsuite"
import styled from "styled-components"
import { useHistory } from "react-router-dom"
import { When } from "react-if"
import { Box, ThemeProvider } from "@kiwicom/orbit-components"
import getTokens from "@kiwicom/orbit-components/lib/getTokens"


const desktop = {
  topNavWidth: 70,
  subNavWidth: 300,
}

const mobile = {
  topNavHeight: 54,
  subNavHeight: 38,
}

interface Props {
  side?: ReactNode
  size?: 'md' | 'lg'
}

const MainLayout: FC<Props> = ({side, children, size = 'md' }) => {
  const [ showSearchDrawer, setShowSearchDrawer ] = useState(false)
  const [ showSubNav, setShowSubNav ] = useState(false)  // only works in mobile
  const history = useHistory()

  useEffect(() => {
    // 페이지 이동시 초기화
    history.listen(() => setShowSubNav(false))
  }, [ history ])

  const width = size === 'md' ? 1280 : 1680
  const bgColor = '#272c36'

  const customTokens = getTokens({})

  return (
    <ThemeProvider theme={{ orbit: customTokens }}>
      <TempParent>
        <TempHeader>
          <Logo>PA</Logo>
          <Menu onClick={() => history.push(`/tags/all`)}>
            <Icon icon="book2" size="lg" />
          </Menu>
          <Menu onClick={() => history.push(`/notes`)}>
            <Icon icon="sticky-note-o" size="lg" />
          </Menu>
          <Menu onClick={() => setShowSearchDrawer(true)}>
            <Icon icon="search" size="lg" />
          </Menu>
          <Menu onClick={() => history.push(`/settings`)}>
            <Icon icon="cog" size="lg" />
          </Menu>
        </TempHeader>
        <TempBody>
          <When condition={side != null}>
            <TempNav>
              {side}
            </TempNav>
          </When>
          <TempMain>
            <ContentContainer $sideExist={side != null}>
              {children}
            </ContentContainer>
            <SearchDrawer show={showSearchDrawer} onClose={() => setShowSearchDrawer(false)} />
          </TempMain>
        </TempBody>
      </TempParent>
    </ThemeProvider>
  )
}

const Menu: FC<{onClick?: () => void}> = ({ children, onClick }) => (
  <MenuSpan role="button" onClick={() => onClick ? onClick() : null}>
    {children}
  </MenuSpan>
)

const SearchDrawer: FC<{ show: boolean, onClose: () => void }> = ({ show, onClose }) => {
  const [ keyword, setKeyword ] = useState('')
  const history = useHistory()

  const onSubmit = () => {
    setKeyword('')
    onClose()
    history.push(`/articles/search?q=${encodeURIComponent(keyword)}`)
  }

  return (
    <Drawer
      placement="left"
      show={show}
      onHide={() => {
        setKeyword('')
        onClose()
      }}
      style={{ maxWidth: '80%' }}
      size="xs"
    >
      <Drawer.Body>
        <InputGroup inside>
          <Input value={keyword} onChange={setKeyword} onPressEnter={onSubmit}/>
          <InputGroup.Button onClick={onSubmit}>
            <Icon icon="search" />
          </InputGroup.Button>
        </InputGroup>
      </Drawer.Body>
    </Drawer>
  )
}

const TempParent = styled.div`
  display: flex;
  flex-direction: column;
  
  max-width: 1680px;
  margin: 20px auto;
  padding: 10px;
`

const TempHeader = styled.header`
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: 1fr;
  padding: 10px;
`

const TempBody = styled.main`
  /* Take the remaining height */
  flex-grow: 1;
  
  /* Layout the left sidebar, main content */
  display: flex;
  flex-direction: row;
`

const TempNav = styled.aside`
  min-width: 300px;
  height: 100%;
  
  padding: 10px;
`

const TempMain = styled.article`
  /* Take the remaining width */
  flex-grow: 1;
  
  padding: 10px;
  overflow-x: wrap;
`

const ContentContainer = styled(Box)<{ $sideExist: boolean }>`
  // mobile
  @media (max-width: 768px) {
    padding: ${10 + mobile.topNavHeight}px 10px 10px 10px;
  }
  
  // desktop
  @media (min-width: 769px) {
    padding: 10px;
  }
  
  margin-bottom: 200px;
`

const Logo = styled.h1`
  font-size: 22px;
  line-height: 1;
  margin: auto 0;
`

const MenuSpan = styled.span`
  padding: 6px 6px;
  margin: 0 6px;
  cursor: pointer;
`

export default MainLayout