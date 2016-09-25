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
        _id: 1,
        category: 'oranges',
        group: 'groceries',
        amount: 123.1,
        createDate: Math.floor(new Date().getTime() / 1000),
        userID: 'radolasd@gmail.com'
      },
      {
        _id: 2,
        category: 'apples',
        group: 'groceries',
        amount: 153.4,
        createDate: Math.floor(new Date().getTime() / 1000),
        userID: 'radolasd@gmail.com'
      },
      {
        _id: 3,
        category: 'fuel',
        group: 'car',
        amount: 533.8,
        createDate: Math.floor(new Date().getTime() / 1000),
        userID: 'radolasd@gmail.com'
      },
      {
        _id: 4,
        category: 'oranges',
        group: 'groceries',
        amount: 13.3,
        createDate: Math.floor(new Date().getTime() / 1000),
        userID: 'radolasd@gmail.com'
      },
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

function getIndexOfSpendingItem(_id, list) {
  let index = -1;

  for (let i = 0; i < list.length; i++) {
  	if (list[i]._id === _id) {
  	  index = i;
  	  break;
  	}
  }

  return index;
}

function spendings(state = initialState.spendings, action) {
  let list = Object.assign([], state.list), index = -1

  switch(action.type) {
    case 'CREATE_SPENDING':

      list.push(Object.assign({}, action.spending, {_id: new Date().getTime()}))

      return Object.assign({}, state, {list})
    case 'UPDATE_SPENDING':
      index = getIndexOfSpendingItem(action.spending._id, list)

      list[index] = Object.assign({}, action.spending)

      return Object.assign({}, state, {list})
    case 'REMOVE_SPENDING':
      index = getIndexOfSpendingItem(action._id, list)

      return Object.assign({}, state, {
    		list: [
    		  ...list.slice(0, index),
    		  ...list.slice(index + 1)
    		]
  	  })
    case 'REMOVE_SPENDINGS':
      let newList = []

      _.each(list, function(li) {
        if(li.category !== action.spending.category || li.group !== action.spending.group) {
          newList.push(li)
        }
      })

      return Object.assign({}, state, {list: newList})
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
