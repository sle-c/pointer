import firebase from "../api/firebase";
import chunk from "lodash/chunk";
import { COLLECTION } from "../api/constants";
import IUser from "../../domains/user";

interface UpdateUser {
  UID: string,
  name: string,
}

interface UserResponse {
  user: IUser,
}

interface BatchUserResponse {
  users: {
    [uid: string]: IUser
  },
}

class User {
  private db: firebase.firestore.Firestore;

  constructor() {
    this.db = firebase.firestore();
  }

  get = async (uid: string): Promise<UserResponse> => {

    const snapshot = await this.db
      .doc(`${ COLLECTION.USERS }/${ uid }`)
      .get();

    if (snapshot.exists) {

      const data = snapshot.data();

      return {
        user: {
          UID: snapshot.id,
          name: data?.name as string,
        }
      };
    }

    const err = new Error("User not found");
    err.name = "UserNotFound";
    throw err;
  }

  batchGet = async (uids: string[]): Promise<BatchUserResponse> => {
    if (uids.length < 1) {
      return Promise.resolve({
        users: {},
      });
    }
    const IN_LIMIT = 10;
    const uidChunks = chunk(uids, IN_LIMIT);
    const users: { [uid: string]: IUser } = {};

    const usersRef = this.db.collection(COLLECTION.USERS);

    const promises = uidChunks.map((uidChunk: string[]) => {
      return usersRef.where("uid", "in", uidChunk).get();
    });

    const responses = await Promise.all(promises);

    responses.forEach((queryResp) => {
      queryResp.docs.forEach((userDoc) => {
        const userData = userDoc.data();
        const user: IUser = {
          UID: userDoc.id,
          name: userData?.name as string,
        };

        users[userDoc.id] = user;
      });
    });

    return {
      users
    };
  };

  update = async (params: UpdateUser): Promise<UserResponse> => {
    const userRef = this.db.collection(COLLECTION.USERS)
      .doc(params.UID);

    await userRef.set({
      uid: params.UID,
      name: params.name,
    });

    return {
      user: {
        UID: params.UID,
        name: params.name,
      },
    };
  }
}

export default User;