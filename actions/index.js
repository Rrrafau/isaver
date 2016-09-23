import { CALL_API } from '../middleware/api'

import axios from 'axios';

let GraphQLEndpoint = 'http://localhost:3000/api'

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_ERROR = 'LOGIN_ERROR'

function loginSuccess(profile) {
  return {
    type: LOGIN_SUCCESS,
    profile
  }
}

function loginError(error) {
  return {
    type: LOGIN_ERROR,
    error
  }
}

export function login() {
  const lock = new Auth0Lock('dFI6x9UgMQP0dEeEOfpLeCaUrGsXXbO8', 'rafalrad.auth0.com')
  return dispatch => {
    lock.show((error, profile, token) => {
      if(error) {
        return dispatch(loginError(error))
      }
      localStorage.setItem('profile', JSON.stringify(profile))
      localStorage.setItem('id_token', token)
      return dispatch(loginSuccess(profile))
    })
  }
}

export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS'

function logoutSuccess(profile) {
  return {
    type: LOGOUT_SUCCESS
  }
}

export function logout() {
  return dispatch => {
    localStorage.removeItem('id_token')
    localStorage.removeItem('profile')
    return dispatch(logoutSuccess())
  }
}
