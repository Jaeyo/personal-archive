import React from 'react'
import ReactDOM from 'react-dom'
import TimeAgo from "javascript-time-ago"
import App from './App'
import './index.css'
import en from "javascript-time-ago/locale/en"

TimeAgo.addLocale(en)
TimeAgo.setDefaultLocale('en-US')


ReactDOM.render(
  <App/>,
  document.getElementById('root')
)
