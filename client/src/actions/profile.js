import axios from 'axios';
import { setAlert } from './alert';
import {
  GET_PROFILE,
  GET_PROFILES,
  PROFILE_ERROR,
  UPDATE_PROFILE,
  CLEAR_PROFILE,
  ACCOUNT_DELETED,
  GET_REPOS,
} from './types';

// Get current user's profile
export const getCurrentProfile = () => async (dispatch) => {
  try {
    const res = await axios.get('api/profile/me');

    dispatch({
      type: GET_PROFILE,
      payload: res.data, // Whole profile data as that route returns
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,

      // err.response.statusText is error message sended by that route
      // err.response.status is HTTP status
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get all profiles
export const getProfiles = () => async (dispatch) => {
  dispatch({ type: CLEAR_PROFILE });

  try {
    const res = await axios.get('api/profile');

    dispatch({
      type: GET_PROFILES,
      payload: res.data, // All profiles
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,

      // err.response.statusText is error message sended by that route
      // err.response.status is HTTP status
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get profile by id
export const getProfileById = (userId) => async (dispatch) => {
  try {
    console.log(`api/profile/user/${userId}`);
    const res = await axios.get(`api/profile/user/${userId}`);
    console.log(res.data);

    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (err) {
    //console.log(`Can't get user by id = ${userId}`);

    dispatch({
      type: PROFILE_ERROR,

      // err.response.statusText is error message sended by that route
      // err.response.status is HTTP status
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get Github repos
export const getGithubRepos = (username) => async (dispatch) => {
  try {
    const res = await axios.get(`api/profile/github/${username}`);

    dispatch({
      type: GET_REPOS,
      payload: res.data, // User's Github repos
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,

      // err.response.statusText is error message sended by that route
      // err.response.status is HTTP status
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Create or update profile (can create separate func to update/editing profile)
export const createProfile = (formData, history, edit = false) => async (
  dispatch
) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const res = await axios.post('/api/profile', formData, config);

    dispatch({
      type: GET_PROFILE,
      payload: res.data, // Whole profile data as that route returns
    });

    dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success'));

    // If its created (not updated) profile
    if (!edit) {
      // Using 'history' component because we can't use Redirect here
      // (can use Redirect only in component')
      history.push('/dashboard');
    }
  } catch (err) {
    // Here we get errors array from a server
    const errors = err.response.data.errors;

    if (errors) {
      //console.log(errors[0].msg);
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: PROFILE_ERROR,

      // err.response.statusText is error message sended by that route
      // err.response.status is HTTP status
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Add Experience
export const addExperience = (formData, history) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const res = await axios.put('/api/profile/experience', formData, config);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data, // Whole profile data as that route returns
    });

    dispatch(setAlert('Experience Added', 'success'));

    // Using 'history' component because we can't use Redirect here
    // (can use Redirect only in component')
    history.push('/dashboard');
  } catch (err) {
    // Here we get errors array from a server
    const errors = err.response.data.errors;

    if (errors) {
      //console.log(errors[0].msg);
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: PROFILE_ERROR,

      // err.response.statusText is error message sended by that route
      // err.response.status is HTTP status
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Add Education
export const addEducation = (formData, history) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const res = await axios.put('/api/profile/education', formData, config);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data, // Whole profile data as that route returns
    });

    dispatch(setAlert('Education Added', 'success'));

    // Using 'history' component because we can't use Redirect here
    // (can use Redirect only in component')
    history.push('/dashboard');
  } catch (err) {
    // Here we get errors array from a server
    const errors = err.response.data.errors;

    if (errors) {
      //console.log(errors[0].msg);
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: PROFILE_ERROR,

      // err.response.statusText is error message sended by that route
      // err.response.status is HTTP status
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Delete experience
export const deleteExperience = (id) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/profile/experience/${id}`);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });

    dispatch(setAlert('Experience Removed', 'success'));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,

      // err.response.statusText is error message sended by that route
      // err.response.status is HTTP status
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Delete education
export const deleteEducation = (id) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/profile/education/${id}`);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });

    dispatch(setAlert('Education Removed', 'success'));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,

      // err.response.statusText is error message sended by that route
      // err.response.status is HTTP status
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Delete account & profile
export const deleteAccount = () => async (dispatch) => {
  if (window.confirm('Are you sure? This can NOT be undone!')) {
    try {
      await axios.delete('/api/profile');

      dispatch({ type: CLEAR_PROFILE });
      dispatch({ type: ACCOUNT_DELETED });

      dispatch(setAlert('Your account has been permanently deleted'));
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,

        // err.response.statusText is error message sended by that route
        // err.response.status is HTTP status
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  }
};
