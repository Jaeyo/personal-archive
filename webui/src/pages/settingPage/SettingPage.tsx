import React, { FC } from "react"
import styled from "styled-components"
import { Panel } from "rsuite"
import SimpleLayout from "../../component/layout/SimpleLayout"
import PocketSetting from "./PocketSetting"


const SettingPage: FC = () => (
  <SimpleLayout>
    <Panel bordered>
      <Title>Pocket</Title>
      <PocketSetting />
    </Panel>
  </SimpleLayout>
)

const Title = styled.h2`
  font-size: 18px;
`

export default SettingPage
