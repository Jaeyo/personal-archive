import React, { FC, useEffect } from "react"
import { useRequestPocketAuth } from "../../apis/SettingApi"
import { Loading } from "@kiwicom/orbit-components"


const PocketAuthPage: FC = () => {
  const [fetching, authPocket] = useRequestPocketAuth()

  useEffect(() => {
    authPocket()
      .then(() => {
        window.location.href = `/settings`
      })
  }, [ authPocket ])

  return fetching ? <Loading type="boxLoader" /> : null
}

export default PocketAuthPage
