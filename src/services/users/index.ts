import firebase from "../api/firebase";
import { COLLECTION } from "../api/constants";
import IUser from "../../domains/user";

interface UpdateUser {
  UID: string,
  name: string,
}

interface UserResponse {
  user: IUser,
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