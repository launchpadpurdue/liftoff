import { combineReducers } from "redux";
import authReducer from "./authReducer";
import memberReducer from "./memberReducer";
import { firebaseReducer } from "react-redux-firebase";

const rootReducer = combineReducers({
  auth: authReducer,
  members: memberReducer,
  firebase: firebaseReducer
});

export default rootReducer;
