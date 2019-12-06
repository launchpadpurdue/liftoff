import { combineReducers } from "redux";
import authReducer from "./authReducer";
import memberReducer from "./memberReducer";
import { firebaseReducer } from "react-redux-firebase";
import themeReducer from "./themeReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  members: memberReducer,
  theme: themeReducer,
  firebase: firebaseReducer
});

export default rootReducer;
