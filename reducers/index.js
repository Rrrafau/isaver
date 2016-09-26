import * as ActionTypes from '../actions'
import { routerReducer as routing } from 'react-router-redux'
import { combineReducers } from 'redux'

let browserStorage = typeof localStorage === 'undefined' ? null : localStorage

const jwtDecode = require('jwt-decode')
const initialState = {
  isAuthenticated: checkTokenExpiry(),
  profile: getProfile(),
  error: '',
  income: {
    list: [

    ]
  },
  spendings: {
    list: [

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

function income(state = initialState.income, action) {
  let list = Object.assign([], state.list), index = -1

  switch(action.type) {
    case 'CREATE_INCOME':

      list.push(Object.assign({}, action.income, {_id: new Date().getTime()}))

      return Object.assign({}, state, {list})
    case 'UPDATE_INCOME':
      index = getIndexOfSpendingItem(action.income._id, list)

      list[index] = Object.assign({}, action.income)

      return Object.assign({}, state, {list})
    case 'REMOVE_INCOME':
      index = getIndexOfSpendingItem(action._id, list)

      return Object.assign({}, state, {
    		list: [
    		  ...list.slice(0, index),
    		  ...list.slice(index + 1)
    		]
  	  })
    case 'REMOVE_INCOME':
      let newList = []

      _.each(list, function(li) {
        if(li.category !== action.income.category || li.group !== action.income.group) {
          newList.push(li)
        }
      })

      return Object.assign({}, state, {list: newList})

    case 'ALL_INCOME':
      return Object.assign({}, state, {list: action.list})
    default:
      return state
  }
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

    case 'ALL_SPENDINGS':

      return Object.assign({}, state, {list: action.list})
    default:
      return state
  }
}

const rootReducer = combineReducers({
  spendings,
  routing,
  income,
  auth,
})

export default rootReducer
