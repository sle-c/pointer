import { DBClient } from "../api";
import ISession, { SessionStatus } from "../../domains/session";

const COLLECTION = "sessions";

interface SessionCreate {
  status: SessionStatus
  hostID: string
};

class Session {
  private db: DBClient;

  constructor() {
    this.db = new DBClient();
  }

  create = (params: SessionCreate) => {
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