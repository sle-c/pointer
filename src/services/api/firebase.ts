// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";

import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FRB_API_KEY,
  authDomain: process.env.REACT_APP_FRB_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FRB_DB_URL,
  projectId: process.env.REACT_APP_FRB_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FRB_STORAGE,
  messagingSenderId: process.env.REACT_APP_MSG_SENDER_ID,
  appId: process.env.REACT_APP_FRB_APP_ID,
  measurementId: process.env.REACT_APP_FRB_MEASUREMENT_ID,
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

export default app;