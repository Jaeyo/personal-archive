import React, { FC } from "react"
import SimpleLayout from "../../component/layout/SimpleLayout"
import PocketSetting from "./PocketSetting"
import { Panel } from "rsuite"


const SettingPage: FC = () => (
  <SimpleLayout>
    <Panel header="Pocket" bordered collapsible defaultExpanded>
      <PocketSetting />
    </Panel>
  </SimpleLayout>
)

export default SettingPage
