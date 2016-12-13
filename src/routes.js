import React from 'react'
import { Route, IndexRoute } from 'react-router'

import App from './pages/App'
import viewManager from './components/viewManager'

export default (
  <Route path='/' component={App}>
    <IndexRoute component={viewManager} />
  </Route>
)
