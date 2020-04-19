import { DBClient } from "../api";
import IUser from "../../domains/user";

const COLLECTION = "users";

interface UpdateUser {
  UID: string,
  name: string,
}

class User {
  private db: DBClient;

  constructor() {
    this.db = new DBClient();
  }

  get = (uid: string) => {
    return new Promise<IUser>((resolve, reject) => {
      this.db.get(`${ COLLECTION }/${ uid }`)
        .then((resp) => {
          const user: IUser = {
            UID: resp.data.uid as string,
            name: resp.data.name as string,
          };

          resolve(user);
        }).catch(reject);
    });
  }

  update = (params: UpdateUser) => {
    return new Promise<IUser>((resolve, reject) => {
      this.db.set(
          COLLECTION,
          {
            uid: params.UID,
            name: params.name,
          },
          params.UID,
        )
        .then(() => {
          const newUser = {
            UID: params.UID,
            name: params.name,
          };

          resolve(newUser);
        }).catch(reject);
    });
  }
}

export default User;