import {
  ALL_SPENDINGS,
  CURRENT_SPENDINGS,
  REMOVE_SPENDING,
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

function updateSpending(variables) {
  let query = `
  	mutation updateSpendingMutation($userID: String!, $category: String!, $amount: Float!, $createDate: Int!) {
  	  updateSpending(userID: $userID, category: $category, amount: $amount, createDate: $createDate) {
        _id
    		userID
    		category
    		amount
        createDate
  	  }
  	}
  `;

  return dispatch => {
  	return axios.post(GraphQLEndpoint, {
  	  query,
  	  variables,
  	}).then((result) => {
  	  if (result.data.errors) {
    		dispatch({
    		  type: UPDATE_SPENDING,
    		  error: result.data.errors,
    		})
    		return;
  	  }
  	  dispatch({
    		type: UPDATE_SPENDING,
    		spending: result.data.data.updateSpending,
  	  });
  	});
  };
}

function removeSpending(variables) {
  let query = `
  	mutation removeSpendingMutation($_id: String!) {
  	  removeSpending(_id: $_id) {
  		  _id
  	  }
  	}
  `;

  return dispatch => {
  	return axios.post(GraphQLEndpoint, {
  	  query,
  	  variables
  	}).then((result) => {
  	  if (result.data.errors) {
    		dispatch({
    		  type: REMOVE_SPENDING,
    		  error: result.data.errors,
    		})
    		return;
  	  }

  	  dispatch({
    		type: REMOVE_SPENDING,
    		spending: result.data.data.removeSpending,
  	  });
  	});
  };
}

module.exports = {
  getCurrentSpendings,
  removeSpending,
  updateSpending,
  getSpendings
}
