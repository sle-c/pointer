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

interface WhereCondition {
  readonly field: string,
  readonly operator: '==' | '>=' | '<=' | '>' | '<' | 'array-contains' | 'in',
  readonly value: any,
};

interface QueryResult {
  ID: string,
  [key: string]: any,
};

enum ErrorCode {
  NotFound = 404,
  NoResults = 204,
  ArgumentErr = 400,
};

const ArgumentError: DBClientError = {
  message: "Missing required argument",
  code: ErrorCode.ArgumentErr,
  type: 'internal',
};

const wrapError = (err: { message: string, code: number }): DBClientError => {
  const errWrapper : DBClientError = {
    message: err.message,
    code: err.code,
    type: "firebase",
  }

  return errWrapper;
};

class DBClient {
  db: firebase.firestore.Firestore;

  constructor() {
    this.db = firebase.firestore();

    // if (window.location.hostname === "localhost") {
    //   console.log("localhost detected!");
    //   this.db.settings({
    //     host: "localhost:8080",
    //     ssl: false
    //   });
    // }
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
        reject(wrapError(err));
      });
    });
  }

  create = (collection: string, params: object) => {
    return new Promise<DBClientResponse>((resolve, reject) => {
      const request = this.db.collection(collection).add({
        ...params,
        createdAt: ServerTimestamp,
        updatedAt: ServerTimestamp,
      });

      request.then((docRef: firebase.firestore.DocumentReference) => {
        docRef
          .get()
          .then((snapshot: firebase.firestore.DocumentSnapshot) => {
            resolve({
              docRef: docRef,
              data: {
                ID: docRef.id,
                ...snapshot.data(),
              }
            });
          });
      }).catch((err) => {
        reject(wrapError(err));
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
          reject(wrapError(err));
        });
    });
  }

  set = (collection: string, params: object) => {
    return new Promise<{ ID: string, [key: string]: any}>((resolve, reject) => {
      const docRef = this.db.collection(collection).doc();

      const newParams = {
        ...params,
        createdAt: ServerTimestamp,
        updatedAt: ServerTimestamp,
      };

      return docRef.set(newParams)
        .then(() => {
          resolve({
            ID: docRef.id,
            ...params,
          });
        }).catch((err) => {
          reject(wrapError(err));
        });
    });
  }

  destroy = (path: string) => {
    return new Promise<void>((resolve, reject) => {
      const docRef = this.db.doc(path);
      return docRef.delete()
        .then(resolve)
        .catch((err) => {
          reject(wrapError(err));
        });
    });
  }

  query = (collection: string, whereConditions: WhereCondition[]) => {
    return new Promise<QueryResult[]>((resolve, reject) => {
      let collectionRef = this.db.collection(collection);

      if (whereConditions.length < 1) {
        reject(ArgumentError);
      }

      const firstCondition: WhereCondition = whereConditions[0];
      let query: firebase.firestore.Query<firebase.firestore.DocumentData> = collectionRef.where(
        firstCondition.field,
        firstCondition.operator,
        firstCondition.value,
      );

      for (let index = 1; index < whereConditions.length; index++) {
        const condition = whereConditions[index];
        query = query.where(
          condition.field,
          condition.operator,
          condition.value,
        );
      }

      query.get()
        .then((snapshot: firebase.firestore.QuerySnapshot) => {
          if (snapshot.empty) {
            resolve([]);
            return;
          }
          let results: QueryResult[] = [];
          snapshot.forEach((docSnapshot: firebase.firestore.QueryDocumentSnapshot) => {
            results.push({
              ID: docSnapshot.id,
              ...docSnapshot.data(),
            });
          });

          resolve(results);
        }).catch((err) => {
          reject(wrapError(err));
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