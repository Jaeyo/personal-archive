import React, { FC, ReactNode, useState } from "react"
import { Container, Drawer, Icon, Input, InputGroup } from "rsuite"
import styled from "styled-components"
import { useHistory } from "react-router-dom"


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
        <NavContainer $width={topNavWidth} $left={0} $vertical $center $bg={bgColor} $zIndex={10}>
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
        </NavContainer>
        {
          side ?
            <NavContainer $width={subNavWidth} $left={topNavWidth} $bg="white" style={{ borderRight: '1px solid #eee'}}>
              {side}
            </NavContainer>
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
  <span
    role="button"
    style={{ padding: '11px 0', margin: '6px 0', cursor: 'pointer', color: 'white' }}
    onClick={() => onClick ? onClick() : null}
  >
    {children}
  </span>
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
  width: ${({ $width }) => $width}px;
  margin: 0 auto;
`

const Logo = styled.h1`
  font-size: 22px;
  margin-bottom: 20px
`

const NavContainer = styled(Container)<{
  $width: number,
  $left: number,
  $vertical?: boolean,
  $bg?: string,
  $center?: boolean,
  $zIndex?: number,
}>`
  position: fixed;
  top: 0;
  bottom: 0;
  padding: ${({ $left }) => `10px 10px 10px ${$left + 10}px`};
  width: ${({ $left, $width }) => `${$left + $width}px`};
  ${({ $vertical }) => $vertical && `
    display: flex;
    flex-direction: column;
  `}
  ${({ $bg }) => $bg && `
    background-color: ${$bg};
  `}
  ${({ $center }) => $center && `
    text-align: center;
  `}
  ${({ $zIndex }) => $zIndex && `
    z-index: ${$zIndex};
  `}
`

const ContentContainer = styled(Container)<{ $left: number }>`
  padding: ${({ $left }) => `10px 10px 10px ${$left + 10}px`};
  background-color: white;
`

export default MainLayout