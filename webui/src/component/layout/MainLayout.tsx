import React, { FC, ReactNode, useEffect, useState } from "react"
import styled from "styled-components"
import { useHistory } from "react-router-dom"
import { Desktop, Drawer, InputField, Mobile, Stack, ThemeProvider } from "@kiwicom/orbit-components"
import getTokens from "@kiwicom/orbit-components/lib/getTokens"
import { When } from "react-if"
import { MenuHamburger } from "@kiwicom/orbit-components/icons"
import { FaRegNewspaper, FaRegStickyNote, FaRegSun, FaSearch } from "react-icons/fa"
import { Helmet } from "react-helmet"
import DarkModeSwitch from "../etc/DarkModeSwitch"


interface Props {
  side?: ReactNode
  title?: string
}

const MainLayout: FC<Props> = ({ side, title, children}) => {
  const [showSearchDrawer, setShowSearchDrawer] = useState(false)
  const [showNav, setShowNav] = useState(false)  // only works in mobile
  const history = useHistory()

  useEffect(() => {
    // 페이지 이동시 초기화
    history.listen(() => setShowNav(false))
  }, [history])

  const customTokens = getTokens({})

  return (
    <ThemeProvider theme={{orbit: customTokens}}>
      <Parent>
        <Helmet>
          <title>{getTitle(title)}</title>
        </Helmet>
        <Header>
          <Logo>PA</Logo>
          <Menu onClick={() => history.push(`/tags/all`)}>
            <FaRegNewspaper size="21px" />
          </Menu>
          <Menu onClick={() => history.push(`/notes`)}>
            <FaRegStickyNote size="21px" />
          </Menu>
          <Menu onClick={() => setShowSearchDrawer(true)}>
            <FaSearch size="21px" />
          </Menu>
          <Menu onClick={() => history.push(`/settings`)}>
            <FaRegSun size="21px" />
          </Menu>
          <DarkModeSwitch />
        </Header>
        <Middle>
          <Mobile>
            <When condition={side != null}>
              <Menu onClick={() => setShowNav(true)}>
                <MenuHamburger/>
              </Menu>
            </When>
          </Mobile>
        </Middle>
        <Body>
          <Desktop>
            <When condition={side != null}>
              <Nav>
                {side}
              </Nav>
            </When>
          </Desktop>
          <Main>
            {children}
            <SearchDrawer show={showSearchDrawer} onClose={() => setShowSearchDrawer(false)}/>
          </Main>
        </Body>
        <Drawer
          shown={showNav}
          onClose={() => setShowNav(false)}
        >
          <Stack>
            {side}
          </Stack>
        </Drawer>
      </Parent>
    </ThemeProvider>
  )
}

const Menu: FC<{ onClick?: () => void }> = ({children, onClick}) => (
  <MenuSpan role="button" onClick={() => onClick ? onClick() : null}>
    {children}
  </MenuSpan>
)

const SearchDrawer: FC<{ show: boolean, onClose: () => void }> = ({show, onClose}) => {
  const [keyword, setKeyword] = useState('')
  const history = useHistory()

  const onSubmit = () => {
    setKeyword('')
    onClose()
    history.push(`/articles/search?q=${encodeURIComponent(keyword)}`)
  }

  return (
    <Drawer
      shown={show}
      onClose={() => {
        setKeyword('')
        onClose()
      }}
    >
      <InputField
        size="small"
        value={keyword}
        onChange={e => setKeyword((e.target as any).value)}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            onSubmit()
          }
        }}
        suffix={
          <span role="button" onClick={onSubmit} style={{ marginRight: '10px' }}>
            <FaSearch />
          </span>
        }
      />
    </Drawer>
  )
}

const getTitle = (title: string | undefined): string => {
  if (!title) {
    return 'Personal Archive'
  }
  return `${title} - Personal Archive`
}

const Parent = styled.div`
  display: flex;
  flex-direction: column;
  
  padding: 10px;
  
  // desktop
  @media (min-width: 769px) {
    max-width: 1680px;
    margin: 20px auto;
  }
  
  // mobile
  @media (max-width: 768px) {
    width: 100%;
    overflow: auto;
    overflow-wrap: anywhere;
    word-break: break-all;
  }
`

const Header = styled.header`
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: 1fr;
  padding: 10px;
`

const Middle = styled.div`
  padding: 4px 8px;
  text-align: right;
`

const Body = styled.main`
  /* Take the remaining height */
  flex-grow: 1;
  
  /* Layout the left sidebar, main content */
  display: flex;
  flex-direction: row;
`

const Nav = styled.aside`
  padding: 10px;
  
  // desktop
  @media (min-width: 769px) {
    min-width: 300px;
    height: 100%;
  }
`

const Main = styled.article`
  /* Take the remaining width */
  flex-grow: 1;
  
  padding: 10px;
  max-width: 100%;
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