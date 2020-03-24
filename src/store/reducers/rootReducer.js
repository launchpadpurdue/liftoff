import { combineReducers } from "redux";
import authReducer from "./authReducer";
import eventReducer from "./eventReducer";
import preferenceReducer from "./preferenceReducer";
import { firebaseReducer } from "react-redux-firebase";
import { firestoreReducer } from "redux-firestore";
import notificationReducer from "./notificationReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  events: eventReducer,
  notifications: notificationReducer,
  preferences: preferenceReducer,
  firebase: firebaseReducer,
  firestore: firestoreReducer
});

export default rootReducer;
