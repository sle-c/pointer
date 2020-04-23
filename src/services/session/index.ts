import firebase from "../api/firebase";
import { ServerTimestamp } from "../api/firebase_constants";
import ISession, { SessionStatus } from "../../domains/session";
import Membership, { Role } from "../../domains/membership";

import isEmpty from "lodash/isEmpty";

const SESSION_COLLECTION = "sessions";

interface SessionCreate {
  hostID: string
};

interface SessionResponse {
  session: ISession,
};

interface SessionJoin {
  sessionID: string,
  userUID: string,
}

class Session {
  private db: firebase.firestore.Firestore;

  constructor() {
    this.db = firebase.firestore();
  }

  join = async (params: SessionJoin): Promise<SessionResponse> => {
    const sessionRef = this.db.doc(`${ SESSION_COLLECTION }/${ params.sessionID }`);
    const sessionSnapshot = await sessionRef.get();
    const sessionData = sessionSnapshot.data();

    if (sessionSnapshot.exists) {
      const members = sessionData?.members || {};
      const session = {
        ID: sessionRef.id,
        status: sessionData?.status as SessionStatus,
        hostID: sessionData?.hostID as string,
        members: sessionData?.members as { [key: string]: Membership },
        updatedAt: sessionData?.updatedAt.toDate(),
        createdAt: sessionData?.createdAt.toDate(),
      };

      if (!isEmpty(members[params.userUID])) {
        return {
          session: session,
        };
      }

      const newMember = {
        uid: params.userUID,
        role: Role.member,
        lastActiveAt: new Date(),
      };

      await sessionRef.update({
        [`members.${ params.userUID }`]: newMember,
        updatedAt: ServerTimestamp,
      });

      return{
        session: {
          ...session,
          members: {
            ...session.members,
            [params.userUID]: newMember,
          },
          updatedAt: new Date(),
        },
      };
    }

    const err = new Error("Session not found");
    err.name = "SessionNotFound";
    throw err;
  };

  create = async (params: SessionCreate): Promise<SessionResponse> => {
    type NewSession = Omit<ISession, "ID">;
    const sessionParams: NewSession = {
      ...params,
      status: SessionStatus.Active,
      members: {
        [params.hostID]: {
          uid: params.hostID,
          role: Role.host,
          lastActiveAt: new Date(),
        },
      },
    };

    const sessionRef = await this.db
      .collection(SESSION_COLLECTION)
      .add({
        ...sessionParams,
        createdAt: ServerTimestamp,
        updatedAt: ServerTimestamp,
      });

    return {
      session: {
        ID: sessionRef.id,
        ...sessionParams,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    };
  }
}

export default Session;
export type { SessionResponse };