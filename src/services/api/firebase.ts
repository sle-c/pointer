// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";

import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.FRB_API_KEY,
  authDomain: process.env.FRB_AUTH_DOMAIN,
  databaseURL: process.env.FRB_DB_URL,
  projectId: process.env.FRB_PROJECT_ID,
  storageBucket: process.env.FRB_STORAGE,
  messagingSenderId: process.env.MSG_SENDER_ID,
  appId: process.env.FRB_APP_ID,
  measurementId: process.env.FRB_MEASUREMENT_ID,
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

export default app;