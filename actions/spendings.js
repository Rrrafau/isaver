import {
  CREATE_SPENDING,
  CALCULATE_SPENDINGS,
  ALL_SPENDINGS,
  CURRENT_SPENDINGS,
  REMOVE_SPENDING,
  REMOVE_SPENDINGS,
  UPDATE_SPENDING
} from './actionTypes/spendings';

import axios from 'axios';

let GraphQLEndpoint = 'http://localhost:3001/api'

if (process.env.NODE_ENV === 'production') {
  GraphQLEndpoint = 'http://isaver.online/api'
}

function getCurrentSpendings(variables) {
  let query = `
    query getCurrentSpendings($userID: String!, $createDate: Int!) {
      currentSpendings(userID: $userID, createDate: $createDate) {
        userID
        category
        amount
        createDate
      }
    }
  `;

  return dispatch => {
    return axios.post(GraphQLEndpoint, {
  	  query, variables
  	}).then((result) => {
      if (result.data.errors) {
    		dispatch({
    		  type: CURRENT_SPENDINGS,
    		  error: result.data.errors,
    		})
    		return
  	  }

  	  dispatch({
    		type: CURRENT_SPENDINGS,
    		currentSpendings: result.data.data.currentSpendings,
  	  })
    })
  }
}

function getSpendings() {
  let query = `
  	query getSpendings {
  	  spendings {
    		userID
        category
        amount
        createDate
  	  }
  	}
  `

  return dispatch => {
  	return axios.post(GraphQLEndpoint, {
  	  query
  	}).then((result) => {
  	  if (result.data.errors) {
    		dispatch({
    		  type: ALL_SPENDINGS,
    		  error: result.data.errors,
    		})
    		return;
  	  }

  	  dispatch({
    		type: ALL_SPENDINGS,
    		spendings: result.data.data.spendings,
  	  })
  	})
  }
}

function createSpending(variables) {
  let query = `
  	mutation createSpendingMutation(
      $category: String!
      $group: String!
      $userID: String!
      $createDate: Int!
      $amount: Float!
    ) {
  	  createSpending(
        category: $category
        amount: $amount
        group: $group
        userID: $userID
        createDate: $createDate
      ) {
    		_id
    		category
    		amount
        userID
        createDate
        group
  	  }
  	}
    `;

  return dispatch => {
  	return axios.post(GraphQLEndpoint, {
  	  query,
  	  variables,
  	}).then((result) => {
      dispatch({
        type: CREATE_SPENDING,
        spending: result.data.data.createSpending
      })
    })
  }
}

function updateSingleSpending(spending) {
  return function (dispatch) {
    dispatch({
      type: UPDATE_SPENDING,
      spending
    })
  }
}

function removeSingleSpending(_id) {
  return function (dispatch) {
    dispatch({
      type: REMOVE_SPENDING,
      _id: _id
    })
  }
}

function removeSpendings(spending) {
  return function (dispatch) {
	  dispatch({
  		type: REMOVE_SPENDINGS,
  		spending
	  })
  }
}

module.exports = {
  createSpending,
  removeSingleSpending,
  getCurrentSpendings,
  removeSpendings,
  updateSingleSpending,
  getSpendings
}
