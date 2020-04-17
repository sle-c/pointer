import { DBClient } from "../api";
import IUser from "../../domains/user";

const COLLECTION = "users"

interface UserUpdate {
  uid?: string,
  name: string,
};

class User {
  private db: DBClient;

  constructor() {
    this.db = new DBClient();
  }

  get = (uid: string) => {
    return new Promise<IUser>((resolve, reject) => {
      this.db.query(
        COLLECTION,
        [
          {
            field: "uid",
            operator: "==",
            value: uid,
          }
        ],
      ).then((results) => {
        if (results.length > 0) {
          const user = results[0];
          resolve({
            UID: user.ID as string,
            name: user.name as string,
          });
        }
      });
    });
  }

  update = (params: UserUpdate) => {
    return new Promise<IUser>((resolve, reject) => {
      this.db.set(COLLECTION, params)
        .then((user) => {
          resolve({
            UID: user.ID,
            name: user.name as string,
          });
        }).catch(reject);
    });
  }
}

export default User;