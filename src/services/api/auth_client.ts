import firebase from "./firebase";
import User from "../../domains/user";

import { AUTH_LOCAL, AUTH_SESSION, AUTH_PROVIDERS } from "./firebase_constants";

interface UserInfo {
  name?: string,
  photoURL?: string,
}

interface AuthError {
  readonly message: string,
  readonly code: number,
  readonly type: 'firebase' | 'internal',
}

enum ErrorCode {
  NotSignedIn = 401,
  NotFound = 404,
}

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

  updateUserInfo = (data: UserInfo) => {
    return new Promise<void>((resolve, reject) => {
      const user = firebase.auth().currentUser;

      if (user) {
        const req = user.updateProfile({
          displayName: data.name || user.displayName,
          photoURL: data.photoURL || user.photoURL,
        });

        req.then(resolve).catch((err) => {
          const wrapErr: AuthError = {
            message: err.message,
            code: err.code,
            type: "firebase",
          };
          reject(wrapErr);
        });

        return;
      }

      reject(ErrNotSignedIn);
    });
  }

  currentUser = (): User | null => {
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
          if (userData.user) {
            resolve({
              UID: userData.user.uid,
              email: userData.user.email,
              name: userData.user.displayName,
              verified: userData.user.emailVerified,
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
                  name: userData.user.displayName,
                  verified: userData.user.emailVerified,
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

  signInAnonymously = () => {
    return new Promise<User>((resolve, reject) => {
      this.auth
        .setPersistence(AUTH_LOCAL).then(() =>{
          this.auth.signInAnonymously()
          .then((anoUserData) => {
            if (anoUserData.user) {
              resolve({
                UID: anoUserData.user?.uid,
                name: anoUserData.user?.displayName,
                isAnonymous: anoUserData.user?.isAnonymous,
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
                email: userData.user.email,
                name: userData.user.displayName,
                verified: userData.user.emailVerified,
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
}

export default AuthClient;