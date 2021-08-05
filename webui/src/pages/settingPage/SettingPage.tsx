import React, { FC } from "react"
import SimpleLayout from "../../component/layout/SimpleLayout"
import PocketSetting from "./PocketSetting"
import { CardSection, Card } from "@kiwicom/orbit-components"
import { FaGetPocket } from "react-icons/fa"


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
  </SimpleLayout>
)

export default SettingPage
