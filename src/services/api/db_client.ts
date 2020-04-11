import firebase from "./firebase";
import { ServerTimestamp } from "./firebase_constants";

interface GetDocOptions {
  readonly source?: 'default' | 'server' | 'cache';
}

interface DBClientResponse {
  readonly docRef: firebase.firestore.DocumentReference,
  readonly data: { [key: string]: any },
}

interface DBClientError {
  readonly message: string,
  readonly code: number,
  readonly type: 'firebase' | 'internal',
}

enum ErrorCode {
  NotFound = 404
}

class DBClient {
  db: firebase.firestore.Firestore;

  constructor() {
    this.db = firebase.firestore();

    if (window.location.hostname === "localhost") {
      console.log("localhost detected!");
      this.db.settings({
        host: "localhost:8080",
        ssl: false
      });
    }
  }

  get = (path: string, options?: GetDocOptions) => {
    return new Promise<DBClientResponse>((resolve, reject) => {

      const docRef = this.db.doc(path);

      return docRef.get(options).then((snapshot: firebase.firestore.DocumentSnapshot) => {
        if (snapshot.exists) {
          resolve({
            docRef: docRef,
            data: snapshot.data() || {},
          });
        } else {
          const err : DBClientError = {
            message: "Record not found",
            code: ErrorCode.NotFound,
            type: "internal",
          };
          reject(err);
        }
      }).catch((err) => {
        const errWrapper : DBClientError = {
          message: err.message,
          code: err.code,
          type: "firebase",
        };
        reject(errWrapper);
      });
    });
  }

  create = (collection: string, params: object) => {
    return new Promise<DBClientResponse>((resolve, reject) => {
      const request = this.db.collection(collection).add(params);

      request.then((docRef: firebase.firestore.DocumentReference) => {
        resolve({
          docRef: docRef,
          data: {
            ID: docRef.id,
            ...params,
            createdAt: ServerTimestamp,
            updatedAt: ServerTimestamp,
          }
        });
      }).catch((err) => {
        const errWrapper : DBClientError = {
          message: err.message,
          code: err.code,
          type: "firebase",
        };
        reject(errWrapper);
      });
    });
  }

  update = (path: string, params: object) => {
    return new Promise<void>((resolve, reject) => {
      const docRef = this.db.doc(path);

      return docRef.update({
          ...params,
          updatedAt: ServerTimestamp,
        })
        .then(resolve)
        .catch((err) => {
          const errWrapper : DBClientError = {
            message: err.message,
            code: err.code,
            type: "firebase",
          };
          reject(errWrapper);
        });
    });
  }

  destroy = (path: string) => {
    return new Promise<void>((resolve, reject) => {
      const docRef = this.db.doc(path);
      return docRef.delete()
        .then(resolve)
        .catch((err) => {
          const errWrapper : DBClientError = {
            message: err.message,
            code: err.code,
            type: "firebase",
          };
          reject(errWrapper);
        });
    });
  }
}

export type {
  DBClientResponse,
  GetDocOptions,
  ErrorCode,
};
export default DBClient;