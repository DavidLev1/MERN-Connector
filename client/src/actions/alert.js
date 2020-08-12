import uuid from 'uuid/v4';
import { SET_ALERT, REMOVE_ALERT } from './types';

// Can do it because of 'thunk' middleware
export const setAlert = (msg, alertType, timeout = 5000) => (dispatch) => {
  const id = uuid;

  // setAlert action going to dispatch the 'SET_ALERT' type
  // to the reducer (reducers/alert.js), so reducer will
  // add alert to the state
  dispatch({
    type: SET_ALERT,
    payload: { msg, alertType, id },
  });

  setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
};
