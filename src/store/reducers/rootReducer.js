import { combineReducers } from "redux";
import authReducer from "./authReducer";
import eventReducer from "./eventReducer";
import preferenceReducer from "./preferenceReducer";
import { firebaseReducer } from "react-redux-firebase";
import { firestoreReducer } from "redux-firestore";

const rootReducer = combineReducers({
  auth: authReducer,
  events: eventReducer,
  preferences: preferenceReducer,
  firebase: firebaseReducer,
  firestore: firestoreReducer
});

export default rootReducer;
