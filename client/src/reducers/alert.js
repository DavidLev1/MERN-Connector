import { SET_ALERT, REMOVE_ALERT } from '../actions/types';

const initialState = [];

// Reducer is just a function that gets a state and an action
export default function (state = initialState, action) {
  // 'action' contains type and payload (data)
  const { type, payload } = action;

  switch (type) {
    case SET_ALERT:
      // Must copy the state cause the original state is immutable
      // state gets the payload of an action, in that case
      // payload = { msg, alertType, id } in actions/alert.js file
      return [...state, payload];

    case REMOVE_ALERT:
      // return only id that not matches to payload (alert to remove)
      return state.filter((alert) => alert.id !== payload);

    default:
      return state;
  }
}
