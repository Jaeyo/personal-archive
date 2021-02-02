import React, { FC, useEffect, useState } from "react"
import { Alert, Loader } from "rsuite"
import { requestPocketAuth } from "../../apis/SettingApi"


const PocketAuthPage: FC = () => {
  const [ fetching, setFetching ] = useState(false)

  useEffect(() => {
    setFetching(true)
    requestPocketAuth()
      .then(isAllowed => {
        window.location.href = `/settings`
      })
      .catch(err => {
        Alert.error(err.toString())
        setFetching(false)
      })
  }, [])

  return fetching ? <Loader center /> : null
}

export default PocketAuthPage
