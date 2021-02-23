import React, { FC, useEffect, useState } from "react"
import { Alert, Loader } from "rsuite"
import { requestPocketAuth } from "../../apis/SettingApi"


const PocketAuthPage: FC = () => {
  const [fetching] = useRequestPocketAuth()
  return fetching ? <Loader center/> : null
}

const useRequestPocketAuth = (): [boolean] => {
  const [fetching, setFetching] = useState(false)
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

  return [fetching]
}

export default PocketAuthPage
