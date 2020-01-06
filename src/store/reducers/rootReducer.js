import { combineReducers } from "redux";
import authReducer from "./authReducer";
import memberReducer from "./memberReducer";
import { firebaseReducer } from "react-redux-firebase";
import { firestoreReducer } from "redux-firestore";
import preferenceReducer from "./preferenceReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  members: memberReducer,
  preferences: preferenceReducer,
  firebase: firebaseReducer,
  firestore: firestoreReducer
});

export default rootReducer;
