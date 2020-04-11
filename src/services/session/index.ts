import { injectable } from "tsyringe";
import { DBClient } from "../api";
import ISession, { SessionStatus } from "../../domains/session";

const COLLECTION = "sessions";

@injectable()
class Session {
  db: DBClient;

  constructor(dbClient: DBClient) {
    this.db = dbClient;
  }

  create = (params: object) => {
    return new Promise<ISession>((resolve, reject) => {
      this.db.create(COLLECTION, params).then((resp) =>{
        resolve({
          ID: resp.data.ID as string,
          status: resp.data.status as SessionStatus,
          hostID: resp.data.hostID as string,
          createdAt: resp.data.createdAt as Date,
          updatedAt: resp.data.updatedAt as Date,
        });
      }).catch(reject);
    });
  }
}

export default Session;