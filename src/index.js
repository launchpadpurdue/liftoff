import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { createStore, applyMiddleware, compose } from "redux";
import rootReducer from "./store/reducers/rootReducer";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import firebase from "./config/firebaseConfig";
import { ReactReduxFirebaseProvider, getFirebase } from "react-redux-firebase";
import { getFirestore, reduxFirestore } from "redux-firestore";

// Create the redux store
const store = createStore(
  rootReducer,
  compose(
    reduxFirestore(firebase),
    applyMiddleware(thunk.withExtraArgument({ getFirebase, getFirestore }))
  )
);

// Create the config and props for react-redux-firebase
const rrfConfig = {
  attachAuthIsReady: true,
  userProfile: "users",
  useFirestoreForProfile: true // Firestore for Profile instead of Realtime DB
  // enableClaims: true // Get custom claims along with the profile
};

const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch
};

// Render the app using a provider to store the redux and firebase state
ReactDOM.render(
  <Provider store={store}>
    <ReactReduxFirebaseProvider {...rrfProps}>
      <App />
    </ReactReduxFirebaseProvider>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
