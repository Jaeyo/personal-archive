import React, { FC } from "react"
import SimpleLayout from "../../component/layout/SimpleLayout"
import PocketSetting from "./PocketSetting"
import { CardSection, Card } from "@kiwicom/orbit-components"
import { FaGetPocket } from "react-icons/fa"
import EditorSetting from "./EditorSetting"
import { Edit } from "@kiwicom/orbit-components/icons"
import CommandPalette from "./CommandPalette"


const SettingPage: FC = () => (
  <SimpleLayout>
    <Card
      title="Pocket"
      icon={<FaGetPocket />}
    >
      <CardSection>
        <PocketSetting />
      </CardSection>
    </Card>
    <Card
      title="Editor"
      icon={<Edit />}
    >
      <CardSection>
        <EditorSetting />
      </CardSection>
    </Card>
    <CommandPalette />
  </SimpleLayout>
)

export default SettingPage
