import firebase from "./firebase";
import User from "../../domains/user";

import { AUTH_LOCAL, AUTH_SESSION, AUTH_PROVIDERS } from "./firebase_constants";

interface AuthError {
  readonly message: string,
  readonly code: number,
  readonly type: 'firebase' | 'internal',
}

enum ErrorCode {
  NotSignedIn = 401,
  NotFound = 404,
};

const ErrNotSignedIn = {
  message: "User not authenticated",
  code: ErrorCode.NotSignedIn,
  type: "internal",
};

const ErrNotFound = {
  message: "User not found",
  code: ErrorCode.NotFound,
  type: "internal",
};

const wrapError = (err: { code: number, message: string }): AuthError => {
  return {
    message: err.message,
    code: err.code,
    type: "firebase",
  };
};

class AuthClient {
  auth: firebase.auth.Auth;

  constructor() {
    this.auth = firebase.auth();
  }

  currentUser = (): User | null => {
    const user = firebase.auth().currentUser;
    if (user) {
      return {
        UID: user.uid,
        name: user.displayName,
        email: user.email,
        verified: user.emailVerified,
        isAnonymous: user.isAnonymous,
      };
    }
    return null;
  }

  signUp = (email: string, password: string, name?: string) => {
    return new Promise<User>((resolve, reject) => {
      this.auth
        .createUserWithEmailAndPassword(email, password)
        .then((userData) => {
          if (userData.user) {
            if (name) {
              userData.user.updateProfile({ displayName: name });
            }

            resolve({
              UID: userData.user.uid,
              email: userData.user.email,
              verified: userData.user.emailVerified,
              isAnonymous: false,
            });
          }
        })
        .catch((err) => {
          reject(wrapError(err));
        });
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
              if (userData.user) {
                resolve({
                  UID: userData.user.uid,
                  email: userData.user.email,
                  verified: userData.user.emailVerified,
                  isAnonymous: userData.user.isAnonymous,
                });
              } else {
                reject(ErrNotFound);
              }
            })
            .catch((err) => {
              reject(wrapError(err));
            });
        }).catch((err) => {
          reject(wrapError(err));
        });
    });
  }

  signInAnonymously = (name?: string) => {
    return new Promise<User>((resolve, reject) => {
      this.auth
        .setPersistence(AUTH_LOCAL)
        .then(() =>{
          this.auth.signInAnonymously()
            .then((anoUserData) => {
              if (anoUserData.user) {
                if (name) {
                  anoUserData.user.updateProfile({ displayName: name });
                }
                resolve({
                  UID: anoUserData.user?.uid as string,
                  name: name,
                  isAnonymous: true,
                });
              } else {
                reject(ErrNotFound);
              }
            })
            .catch((err) => {
              reject(wrapError(err));
            });
        }).catch((err) => {
          reject(wrapError(err));
        });
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
            if (userData.user) {
              resolve({
                UID: userData.user.uid,
                name: userData.user.displayName,
                email: userData.user.email,
                verified: userData.user.emailVerified,
                isAnonymous: false,
              });
            } else {
              reject(ErrNotFound);
            }
          }).catch((err) => {
            reject(wrapError(err));
          });
      } else {
        reject(ErrNotSignedIn);
      }
    });
  }

  onAuthStateChanged = (callback: (user: User | null) => void) => {
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        callback({
          UID: user.uid,
          name: user.displayName,
          email: user.email,
          verified: user.emailVerified,
          isAnonymous: user.isAnonymous,
        });

        return;
      }
      callback(null);
    });
  }
}

export default AuthClient;