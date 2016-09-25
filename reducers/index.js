import * as ActionTypes from '../actions'
import { routerReducer as routing } from 'react-router-redux'
import { combineReducers } from 'redux'

let browserStorage = typeof localStorage === 'undefined' ? null : localStorage

const jwtDecode = require('jwt-decode')
const initialState = {
  isAuthenticated: checkTokenExpiry(),
  profile: getProfile(),
  error: '',
  spendings: {
    list: [
      {
        category: 'groceries',
        group: 'food',
        amount: 123.4
      },
      {
        category: 'groceries',
        group: 'food',
        amount: 153.4
      }
    ]
  }
}

function checkTokenExpiry() {
  if(browserStorage) {
    let jwt = localStorage.getItem('id_token')
    if(jwt) {
      let jwtExp = jwtDecode(jwt).exp;
      let expiryDate = new Date(0);
      expiryDate.setUTCSeconds(jwtExp);

      if(new Date() < expiryDate) {
        return true;
      }
    }
    return false;
  }
  else {
    return false;
  }
}

function getProfile() {
  if(browserStorage) {
    return JSON.parse(localStorage.getItem('profile'));
  }
  else {
    return {}
  }
}

function auth(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.LOGIN_SUCCESS:
      return Object.assign({}, state, {
        isAuthenticated: true,
        profile: action.profile,
        error: ''
      })
    case ActionTypes.LOGIN_ERROR:
      return Object.assign({}, state, {
        isAuthenticated: false,
        profile: null,
        error: action.error
      })
    case ActionTypes.LOGOUT_SUCCESS:
      return Object.assign({}, state, {
        isAuthenticated: false,
        profile: null
      })
    default:
      return state
    }
}

function spendings(state = initialState.spendings, action) {
  let list = Object.assign([], state.list)
  switch(action.type) {
    case 'CREATE_SPENDING':
      list.push(action.spending)

      return Object.assign({}, state, {list})
    default:
      return state
  }
}

const rootReducer = combineReducers({
  spendings,
  routing,
  auth,
})

export default rootReducer
