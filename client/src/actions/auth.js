import axios from 'axios';
import { setAlert } from './alert';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_PROFILE,
} from './types';

import setAuthToken from '../utils/setAuthToken';

// Load User (check if user loaded successfully and only then gives its data)
export const loadUser = () => async (dispatch) => {
  if (localStorage.token) setAuthToken(localStorage.token);

  try {
    const res = await axios.get('/api/auth');

    dispatch({
      type: USER_LOADED,

      // payload = user data, as defined by api/auth GET request
      // (Login user API: routes/api/auth.js file)
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

// Register User
export const register = ({ name, email, password }) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ name, email, password });
  //const body = { name, email, password };

  try {
    const res = await axios.post('/api/users', body, config);
    // console.log(res.data);
    // console.log(res.data.token);

    // 'register' action going to dispatch the 'REGISTER_SUCCESS' type
    // to the reducer (reducers/auth.js)
    // res.data is a {token: tokenValue} obj sended from server
    dispatch({ type: REGISTER_SUCCESS, payload: res.data });

    dispatch(loadUser());
  } catch (err) {
    // Here we get errors array from a server
    const errors = err.response.data.errors;

    if (errors) {
      //console.log(errors[0].msg);
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    // 'register' action going to dispatch the 'REGISTER_FAIL' type
    // to the reducer (reducers/auth.js)
    dispatch({
      type: REGISTER_FAIL,
    });
  }
};

// Login User
export const login = (email, password) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post('/api/auth', body, config);

    dispatch({ type: LOGIN_SUCCESS, payload: res.data });
    dispatch(loadUser());
  } catch (err) {
    // Here we get errors array from a server
    const errors = err.response.data.errors;

    if (errors) {
      //console.log(errors[0].msg);
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    // 'register' action going to dispatch the 'REGISTER_FAIL' type
    // to the reducer (reducers/auth.js)
    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

// Logout / Clear Profile
export const logout = () => (dispatch) => {
  dispatch({ type: CLEAR_PROFILE });
  dispatch({ type: LOGOUT });
};
