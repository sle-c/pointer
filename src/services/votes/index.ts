import { injectable } from "tsyringe";
import { DBClient } from "../api";
import IVote from "../../domains/votes";

const COLLECTION = "votes";

@injectable()
class Vote {
  db: DBClient;

  constructor(dbClient: DBClient) {
    this.db = dbClient;
  }

  create = (params: object) => {
    return new Promise<IVote>((resolve, reject) => {
      this.db.create(COLLECTION, params).then((resp) =>{
        resolve({
          ID: resp.data.ID as string,
          sessionID: resp.data.sessionID as string,
          userID: resp.data.userID as string,
          createdAt: resp.data.createdAt as Date,
          updatedAt: resp.data.updatedAt as Date,
        });
      }).catch(reject);
    });
  }
}

export default Vote;