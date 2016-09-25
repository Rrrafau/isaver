import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'
import { Router, Route, IndexRoute } from 'react-router'
import { browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import Layout from '../components/Layout'
import Landing from '../components/Landing'
import ManageSpendings from '../components/ManageSpendings'
import configureStore from '../store/configureStore'

const store = configureStore()

let history = browserHistory
if(typeof history !== 'undefined') {
  history = syncHistoryWithStore(browserHistory, store)
}

const appRoutes = () => (
  <Route path="/" component={Layout}>
    <IndexRoute component={ManageSpendings} />
    <Route path="spendings" component={ManageSpendings} />
  </Route>
)

class Root extends Component {
  constructor() {
    super()
  }

  render() {
    return (
      <Provider store={store}>
        <Router history={history}>
          {appRoutes()}
        </Router>
      </Provider>
    )
  }
}

Root.Routes = appRoutes

export const Routes = Root.Routes
export const Store = store

export default Root
