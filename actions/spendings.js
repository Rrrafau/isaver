import {
  CREATE_SPENDING,
  CALCULATE_SPENDINGS,
  ALL_SPENDINGS,
  REMOVE_SPENDING,
  UPDATE_SPENDING
} from './actionTypes/spendings';
import {
  SET_DATES
} from './actionTypes/dates'

import axios from 'axios';
import moment from 'moment';

let GraphQLEndpoint = 'http://localhost:3001/api'

// console.log(process.env.NODE_ENV, (process.env.NODE_ENV === 'production'))
// if (process.env.NODE_ENV === 'production') {
  // GraphQLEndpoint = 'http://isaver.online/api'
// }

function getSpendings(variables) {
  let query = `
    query getSpendings(
      $userID: String!
      $startDate: String!
      $endDate: String!
    ) {
      spendings(
        userID: $userID
        startDate: $startDate
        endDate: $endDate
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
    dispatch({
      type: 'IS_FETCHING',
      fetching: true,
    })
  	return axios.post(GraphQLEndpoint, {
  	  query, variables
  	}).then((result) => {
  	  if (result.data.errors) {
    		dispatch({
    		  type: ALL_SPENDINGS,
    		  error: result.data.errors,
    		})
    		return;
  	  }

      let startDate = variables.startDate

      if(startDate === 'max') {
        if(result.data.data.spendings[0]) {
          startDate = moment(result.data.data.spendings[0].createDate * 1000)
        }
        else {
          startDate = moment()
        }
      }

  	  dispatch({
    		type: ALL_SPENDINGS,
    		list: result.data.data.spendings,
  	  })
      dispatch({
        type: 'IS_FETCHING',
        fetching: false,
      })
      dispatch({
    		type: SET_DATES,
    		dates: {
          startDate: moment(startDate, 'MM DD YYYY'),
          endDate: moment(variables.endDate, 'MM DD YYYY')
        }
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

function updateSingleSpending(variables) {
  let query = `
  	mutation updateSpendingMutation(
      $_id: String!
      $category: String!
      $group: String!
      $userID: String!
      $createDate: Int!
      $amount: Float!
    ) {
  	  updateSpending(
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
        type: UPDATE_SPENDING,
        spending: result.data.data.updateSpending
      })
    })
  }
}

function removeSingleSpending(variables) {
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
  	  dispatch({
    		type: REMOVE_SPENDING,
    		_id: result.data.data.removeSpending._id,
  	  })
  	})
  }
}

module.exports = {
  createSpending,
  removeSingleSpending,
  updateSingleSpending,
  getSpendings
}
