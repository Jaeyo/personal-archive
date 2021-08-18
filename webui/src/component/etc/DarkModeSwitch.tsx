import React, { FC, useEffect } from "react"
import { disable as disableDarkMode, enable as enableDarkMode, setFetchMethod } from "darkreader"
import { useLocalStorage } from "../../common/Hooks"
import Toggle from "react-toggle"
import { Moon } from "@kiwicom/orbit-components/icons"
import styled from "styled-components"
import { IoSunny } from "react-icons/all"


const DarkModeSwitch: FC = () => {
  const [isEnabled, setEnabled] = useDarkMode()

  return (
    <Wrapper>
      <Toggle
        defaultChecked={isEnabled}
        onChange={() => setEnabled(!isEnabled)}
        icons={{
          checked: <Moon size="small" />,
          unchecked: <IoSunny />,
        }}
      />
    </Wrapper>
  )
}

const useDarkMode = (): [
  boolean,
  (isEnabled: boolean) => void,
] => {
  const [darkMode, setDarkMode] = useLocalStorage('theme.dark_mode', '0')

  const isEnabled = darkMode === '1'
  const setEnabled = (isEnabled: boolean) => setDarkMode(isEnabled ? '1' : '0')

  useEffect(() => {
    setFetchMethod(window.fetch)
  }, [])

  useEffect(() => {
    setTimeout(() => {
      if (isEnabled) {
        enableDarkMode({
          brightness: 100,
          contrast: 90,
          sepia: 10,
        })
      } else {
        disableDarkMode()
      }
    }, 200)
  }, [isEnabled])

  return [isEnabled, setEnabled]
}

const Wrapper = styled.div`
  padding-top: 4px;
  margin-left: 4px;
  
  .react-toggle-track-check {
    margin-top: 4px;
    margin-bottom: 0;
    color: #f0c545;
  }
  
  .react-toggle-track-x {
    margin-top: 4px;
    margin-bottom: 0;
    right: 14px;
    // color: #eee;
    color: #f0c545;
  }
`

export default DarkModeSwitch