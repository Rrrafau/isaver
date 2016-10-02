import {
  CREATE_INCOME,
  CALCULATE_INCOME,
  ALL_INCOME,
  REMOVE_INCOME,
  UPDATE_INCOME
} from './actionTypes/income';

import axios from 'axios';

let GraphQLEndpoint = 'http://localhost:3001/api'

// console.log(process.env.NODE_ENV, (process.env.NODE_ENV === 'production'))
// if (process.env.NODE_ENV === 'production') {
  GraphQLEndpoint = 'http://isaver.online/api'
// }

function getIncome(variables) {
  let query = `
    query getIncome(
      $userID: String!
      $timeline: String!
    ) {
      income(
        userID: $userID
        timeline: $timeline
      ) {
        _id
        userID
        category
        amount
        group
        createDate
      }
    }
  `

  return dispatch => {
  	return axios.post(GraphQLEndpoint, {
  	  query, variables
  	}).then((result) => {
  	  if (result.data.errors) {
    		dispatch({
    		  type: ALL_INCOME,
    		  error: result.data.errors,
    		})
    		return;
  	  }
  	  dispatch({
    		type: ALL_INCOME,
    		list: result.data.data.income,
  	  })
  	})
  }
}

function createIncome(variables) {
  let query = `
  	mutation createIncomeMutation(
      $category: String!
      $group: String!
      $userID: String!
      $createDate: Int!
      $amount: Float!
    ) {
  	  createIncome(
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
        type: CREATE_INCOME,
        income: result.data.data.createIncome
      })
    })
  }
}

function updateSingleIncome(variables) {
  let query = `
  	mutation updateIncomeMutation(
      $_id: String!
      $category: String!
      $group: String!
      $userID: String!
      $createDate: Int!
      $amount: Float!
    ) {
  	  updateIncome(
        _id: $_id
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
        type: UPDATE_INCOME,
        income: result.data.data.updateIncome
      })
    })
  }
}

function removeSingleIncome(variables) {
  let query = `
  	mutation removeIncomeMutation($_id: String!) {
  	  removeIncome(_id: $_id) {
  		  _id
  	  }
  	}
    `;

  return dispatch => {
  	return axios.post(GraphQLEndpoint, {
  	  query,
  	  variables
  	}).then((result) => {
  	  dispatch({
    		type: REMOVE_INCOME,
    		_id: result.data.data.removeIncome._id,
  	  })
  	})
  }
}

module.exports = {
  createIncome,
  removeSingleIncome,
  updateSingleIncome,
  getIncome
}
