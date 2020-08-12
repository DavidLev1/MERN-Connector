import { combineReducers } from 'redux';
import alert from './alert'; // Bring 'alert' reducer
import auth from './auth'; // Bring 'auth' reducer
import profile from './profile'; // Bring 'profile' reducer

// combineReducers contains obj of all reducers we create
export default combineReducers({ alert, auth, profile });
