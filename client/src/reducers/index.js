// This is a root reducer

import { combineReducers } from 'redux';
import alert from './alert'; // Bring 'alert' reducer
import auth from './auth'; // Bring 'auth' reducer
import profile from './profile'; // Bring 'profile' reducer
import post from './post'; // Bring 'post' reducer

// combineReducers contains obj of all reducers in the app
export default combineReducers({ alert, auth, profile, post });
