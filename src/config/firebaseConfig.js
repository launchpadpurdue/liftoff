import firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

const config = {
  apiKey: "AIzaSyDnQxWCv1acolcTS0IlKlMXyUzMyNBLXI8",
  authDomain: "launchpadliftoff.firebaseapp.com",
  databaseURL: "https://launchpadliftoff.firebaseio.com",
  projectId: "launchpadliftoff",
  storageBucket: "launchpadliftoff.appspot.com",
  messagingSenderId: "872584838230",
  appId: "1:872584838230:web:e8cf91e6cc0d0b301b0ff7"
};

firebase.initializeApp(config);

// firebase.firestore().settings({ timestampsInSnapshots: true });

export default firebase;
