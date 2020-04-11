import * as firebase from "firebase/app";

const ServerTimestamp = firebase.firestore.FieldValue.serverTimestamp();
const AUTH_SESSION = firebase.auth.Auth.Persistence.SESSION;
const AUTH_LOCAL = firebase.auth.Auth.Persistence.LOCAL;

const AUTH_PROVIDERS = {
  EMAIL: firebase.auth.EmailAuthProvider,
};

export {
  ServerTimestamp,
  AUTH_SESSION,
  AUTH_LOCAL,
  AUTH_PROVIDERS,
};