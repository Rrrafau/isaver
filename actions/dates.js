import {
  SET_DATES
} from './actionTypes/dates';

function setDatesAction(dates) {
  return {
    type: SET_DATES,
    dates
  }
}

export function setDates(dates) {
  return dispatch => {
    return dispatch(setDatesAction(dates))
  }
}
