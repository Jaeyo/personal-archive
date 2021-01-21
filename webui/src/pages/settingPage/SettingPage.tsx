import React, { FC } from "react"
import { Panel } from "rsuite"
import SimpleLayout from "../../component/layout/SimpleLayout"
import PocketSetting from "./PocketSetting"


const SettingPage: FC = () => (
  <SimpleLayout>
    <Panel bordered>
      <PocketSetting />
    </Panel>
  </SimpleLayout>
)

export default SettingPage
