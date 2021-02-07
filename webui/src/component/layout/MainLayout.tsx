import React, { FC, ReactNode, useState } from "react"
import { Container, Drawer, Icon, Input, InputGroup } from "rsuite"
import styled from "styled-components"
import { useHistory } from "react-router-dom"


const desktop = {
  topNavWidth: 70,
  subNavWidth: 300,
}

const mobile = {
  topNavHeight: 54,
  subNavHeight: 70,
}

interface Props {
  side?: ReactNode
  size?: 'md' | 'lg'
}

const MainLayout: FC<Props> = ({side, children, size = 'md' }) => {
  const [ showSearchDrawer, setShowSearchDrawer ] = useState(false)

  const history = useHistory()

  const width = size === 'md' ? 1280 : 1680
  const bgColor = '#272c36'
  const topNavWidth = 70
  const subNavWidth = 300
  const contentLeft = topNavWidth + (side ? subNavWidth : 0)

  return (
    <OuterContainer $bgColor={bgColor}>
      <InnerContainer $width={width}>
        <TopNavContainer $left={0} $vertical $center $bg={bgColor} $zIndex={10}>
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
        </TopNavContainer>
        {
          side ?
            <SubNavContainer $bg="white">
              {side}
            </SubNavContainer>
            : null
        }
        <ContentContainer $left={contentLeft}>
          {children}
        </ContentContainer>
        <SearchDrawer show={showSearchDrawer} onClose={() => setShowSearchDrawer(false)} />
      </InnerContainer>
    </OuterContainer>
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

const OuterContainer = styled(Container)<{ $bgColor: string }>`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  overflow: auto;
  background-color: ${({ $bgColor }) => $bgColor};
`

const InnerContainer = styled(Container)<{ $width: number }>`
  position: relative;
  margin: 0 auto;
  
  // mobile
  @media (max-width: 768px) {
    width: 100%
  }
  
  // desktop 
  @media (min-width: 769px) {
    width: ${({ $width }) => $width}px;
  }
`

const TopNavContainer = styled(Container)<{ $bg?: string }>`
  position: fixed;
 
  // mobile
  @media (max-width: 768px) {
    top: 0;
    left: 0;
    right: 0;
    padding: 15px 20px 15px 30px;
    height: ${mobile.topNavHeight}px;
    // header align
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: 1fr;
  }
 
  // desktop 
  @media (min-width: 769px) {
    top: 0;
    bottom: 0;
    padding: 10px;
    width: ${desktop.topNavWidth}px;
    // vertical
    display: flex;
    flex-direction: column;
    // center
    text-align: center;
  }
  
  ${({ $bg }) => $bg && `
    background-color: ${$bg};
  `}
  
  z-index: 10;
`

const SubNavContainer = styled(Container)<{ $bg?: string }>`
  position: fixed;
 
  // mobile
  @media (max-width: 768px) {
    top: ${mobile.topNavHeight}px;
    // TODO IMME
  }
  
  // desktop
  @media (min-width: 769px) {
    top: 0;
    bottom: 0;
    padding: ${`10px 10px 10px ${desktop.topNavWidth}px`};
    width: ${desktop.topNavWidth + desktop.subNavWidth};
    border-right: 1px solid #eee;
    
    ${({ $bg }) => $bg && `
      background-color: ${$bg};
    `}
  }
`

const ContentContainer = styled(Container)<{ $left: number }>`
  padding: ${({ $left }) => `10px 10px 10px ${$left + 10}px`};
  background-color: white;
`

const Logo = styled.h1`
  display: inline;
  font-size: 22px;
  line-height: 1;
  
  // desktop
  @media (min-width: 769px) {
    margin: 30px 0;
  }
`

const MenuSpan = styled.span`
  // mobile
  @media (max-width: 768px) {
    padding: 2px 4px;
    margin: 0 4px;
    cursor: pointer;
    color: white;
  }

  // desktop 
  @media (min-width: 769px) {
    padding: 11px 0;
    margin: 6px 0;
    cursor: pointer;
    color: white;
  }
`

export default MainLayout