import React from "react"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import { RecoilRoot } from "recoil"
import CreateArticlePage from "./pages/createArticlePage/CreateArticlePage"
import ArticlePage from "./pages/articlePage/ArticlePage"
import ArticlesByTagPage from "./pages/articlesByTagPage/ArticlesByTagPage"
import EditArticlePage from "./pages/editArticlePage/EditArticlePage"
import "rsuite/dist/styles/rsuite-default.css"
import SearchPage from "./pages/searchPage/SearchPage"

const App = () => (
  <RecoilRoot>
    <BrowserRouter>
      <div>
        <Switch>
          <Route path="/articles/search">
            <SearchPage />
          </Route>
          <Route path="/articles/:id/edit">
            <EditArticlePage />
          </Route>
          <Route path="/articles/:id">
            <ArticlePage />
          </Route>
          <Route path="/tags/:tag">
            <ArticlesByTagPage />
          </Route>
          <Route path="/">
            <CreateArticlePage />
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  </RecoilRoot>
)

export default App
