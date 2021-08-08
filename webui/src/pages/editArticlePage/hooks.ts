import { useState } from "react"
import { requestUpdateContent } from "../../apis/ArticleApi"
import { toast } from "react-hot-toast"


export const useEditContent = (): [boolean, (articleID: number, content: string) => void] => {
  const [fetching, setFetching] = useState(false)

  const submit = (articleID: number, content: string) => {
    setFetching(true)
    requestUpdateContent(articleID, content)
      .then(() => window.location.href = `/articles/${articleID}`)
      .catch(err => {
        toast.error(err.toString())
        setFetching(false)
      })
  }

  return [fetching, submit]
}
