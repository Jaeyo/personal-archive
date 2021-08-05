import React, { FC, useEffect, useState } from "react"
import { requestPocketAuth } from "../../apis/SettingApi"
import { toast } from "react-hot-toast"
import { Loading } from "@kiwicom/orbit-components"


const PocketAuthPage: FC = () => {
  const [fetching] = useRequestPocketAuth()
  return fetching ? <Loading type="boxLoader" /> : null
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
        toast.error(err.toString())
        setFetching(false)
      })
  }, [])

  return [fetching]
}

export default PocketAuthPage
