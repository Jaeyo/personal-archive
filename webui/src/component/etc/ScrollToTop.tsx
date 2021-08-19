import { FC } from "react"
import { withRouter, RouteComponentProps } from "react-router"
import { usePrevious } from "../../common/Hooks"


const ScrollToTop: FC<RouteComponentProps> = ({ location }) => {
  const prevLocation = usePrevious(location)

  if (!location || !prevLocation) {
    return null
  }

  if (location.pathname !== prevLocation.pathname) {
    window.scrollTo(0, 0)
  }

  return null
}

export default withRouter(ScrollToTop)
