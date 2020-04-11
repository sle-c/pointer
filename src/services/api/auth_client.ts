import firebase from "./firebase";
import User from "../../domains/user";

import { AUTH_LOCAL, AUTH_SESSION, AUTH_PROVIDERS } from "./firebase_constants";

class AuthClient {
  auth: firebase.auth.Auth;

  constructor() {
    this.auth = firebase.auth();
  }

  currentUser(): User | null{
    const user = firebase.auth().currentUser;
    if (user) {
      return {
        UID: user.uid,
        email: user.email,
        name: user.displayName,
        verified: user.emailVerified,
      };
    }
    return null;
  }

  signUp = (email: string, password: string) => {
    return new Promise<User>((resolve, reject) => {
      this.auth
        .createUserWithEmailAndPassword(email, password)
        .then((userData) => {
          resolve({
            UID: userData.user?.uid,
            email: userData.user?.email,
            name: userData.user?.displayName,
            verified: userData.user?.emailVerified,
          });
        })
        .catch(reject);
    });
  }

  signIn = (email: string, password: string, rememberMe: boolean) => {
    return new Promise<User>((resolve ,reject) => {
      const persistence = rememberMe ? AUTH_LOCAL : AUTH_SESSION;

      this.auth
        .setPersistence(persistence)
        .then(() => {
          this.auth.signInWithEmailAndPassword(email, password)
            .then((userData) => {
              resolve({
                UID: userData.user?.uid,
                email: userData.user?.email,
                name: userData.user?.displayName,
                verified: userData.user?.emailVerified,
              });
            })
            .catch(reject);
        }).catch(reject);
    });
  }

  signInAnonymously = () => {
    return new Promise<User>((resolve, reject) => {
      this.auth
        .signInAnonymously()
        .then((anoUserData) => {
          resolve({
            isAnonymous: anoUserData.user?.isAnonymous,
          });
        })
        .catch(reject);
    });
  }

  signOut = () => {
    this.auth.signOut();
  }

  linkAnonymousUser = (email: string, password: string) => {
    return new Promise<User>((resolve, reject) => {
      const credential = AUTH_PROVIDERS.EMAIL.credential(email, password);
      const currentUser = firebase.auth().currentUser;
      if (currentUser) {
        currentUser.linkWithCredential(credential)
          .then((userData) => {
            resolve({
              UID: userData.user?.uid,
              email: userData.user?.email,
              name: userData.user?.displayName,
              verified: userData.user?.emailVerified,
            });
          }).catch(reject);
      } else {
        reject({});
      }
    });
  }
}

export default AuthClient;