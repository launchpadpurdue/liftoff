import firebase from "firebase";
// import 'firebase/firestore';
import "firebase/auth";

const config = {
  apiKey: "AIzaSyDnQxWCv1acolcTS0IlKlMXyUzMyNBLXI8",
  authDomain: "launchpadliftoff.firebaseapp.com",
  databaseURL: "https://launchpadliftoff.firebaseio.com",
  projectId: "launchpadliftoff",
  storageBucket: "launchpadliftoff.appspot.com",
  messagingSenderId: "872584838230",
  appId: "1:872584838230:web:e8cf91e6cc0d0b301b0ff7"
};
// firebase.firestore().settings({ timestampsInSnapshots: true });
firebase.initializeApp(config);

export default firebase;