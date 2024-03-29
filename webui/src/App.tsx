import React from "react"
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom"
import CreateArticlePage from "./pages/createArticlePage/CreateArticlePage"
import ArticlePage from "./pages/articlePage/ArticlePage"
import ArticlesByTagPage from "./pages/articlesByTagPage/ArticlesByTagPage"
import EditArticlePage from "./pages/editArticlePage/EditArticlePage"
import SearchPage from "./pages/searchPage/SearchPage"
import SettingPage from "./pages/settingPage/SettingPage"
import PocketAuthPage from "./pages/pocketAuthPage/PocketAuthPage"
import NoteListPage from "./pages/noteListPage/NoteListPage"
import NewNotePage from "./pages/newNotePage/NewNotePage"
import NotePage from "./pages/notePage/NotePage"
import EditNoteParagraphPage from "./pages/editNoteParagraphPage/EditNoteParagraphPage"
import NewNoteParagraphPage from "./pages/newNoteParagraphPage/NewNoteParagraphPage"
import { Toaster } from "react-hot-toast"
import ScrollToTop from "./component/etc/ScrollToTop"
import GlobalConfirm from "./component/etc/GlobalConfirm"
import GlobalPrompt from "./component/etc/GlobalPrompt"


const App = () => (
  <>
    <BrowserRouter>
      <ScrollToTop />
      <div>
        <Switch>
          <Route path="/articles/new">
            <CreateArticlePage/>
          </Route>
          <Route path="/articles/search">
            <SearchPage/>
          </Route>
          <Route path="/articles/:id/edit">
            <EditArticlePage/>
          </Route>
          <Route path="/articles/:id">
            <ArticlePage/>
          </Route>
          <Route path="/tags/:tag">
            <ArticlesByTagPage/>
          </Route>

          <Route path="/notes/:id/paragraphs/:paragraphID">
            <EditNoteParagraphPage/>
          </Route>
          <Route path="/notes/:id/paragraphs">
            <NewNoteParagraphPage/>
          </Route>
          <Route path="/notes/new">
            <NewNotePage/>
          </Route>
          <Route path="/notes/:id">
            <NotePage/>
          </Route>
          <Route path="/notes">
            <NoteListPage/>
          </Route>

          <Route path="/settings/pocket-auth">
            <PocketAuthPage/>
          </Route>
          <Route path="/settings">
            <SettingPage/>
          </Route>
          <Route path="/">
            <Redirect to="/tags/all"/>
          </Route>
        </Switch>
      </div>
      <GlobalConfirm />
      <GlobalPrompt />
    </BrowserRouter>
    <Toaster position="top-right"/>
  </>
)

export default App
