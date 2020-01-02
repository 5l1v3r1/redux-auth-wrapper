import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { routerReducer, syncHistoryWithStore, routerMiddleware } from 'react-router-redux'
import thunkMiddleware from 'redux-thunk'

import * as reducers from './reducers'
import { App, Home, Foo, Admin, Login } from './components'
import { userIsAuthenticated, userIsAdmin, userIsNotAuthenticated } from './auth'

const baseHistory = browserHistory
const routingMiddleware = routerMiddleware(baseHistory)
const reducer = combineReducers(Object.assign({}, reducers, {
  routing: routerReducer
}))

const enhancer = compose(
  // Middleware you want to use in development:
  applyMiddleware(thunkMiddleware, routingMiddleware),
)

// Note: passing enhancer as the last argument requires redux@>=3.1.0
const store = createStore(reducer, enhancer)
const history = syncHistoryWithStore(baseHistory, store)

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRoute component={Home}/>
        <Route path="login" component={userIsNotAuthenticated(Login)}/>
        <Route path="foo" component={userIsAuthenticated(Foo)}/>
        <Route path="admin" component={userIsAuthenticated(userIsAdmin(Admin))}/>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('mount')
)
