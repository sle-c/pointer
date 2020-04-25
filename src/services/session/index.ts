import firebase, { ServerTimestamp } from "../api/firebase";
import ISession, { SessionStatus } from "../../domains/session";

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

  get = async (sessionID: string): Promise<SessionResponse | null> => {
    const sessionRef = this.db.doc(`${ SESSION_COLLECTION }/${ sessionID }`);
    const sessionSnapshot = await sessionRef.get();
    const sessionData = sessionSnapshot.data();

    if (sessionSnapshot.exists) {
      return {
        session: {
          ID: sessionRef.id,
          status: sessionData?.status as SessionStatus,
          hostID: sessionData?.hostID as string,
          updatedAt: sessionData?.updatedAt.toDate(),
          createdAt: sessionData?.createdAt.toDate(),
        }
      };
    }
    return null;
  }

  join = async (params: SessionJoin): Promise<void> => {
    const memberRef = this.db.collection(
      `${ SESSION_COLLECTION }/${ params.sessionID }/members`
    );

    const newMember = {
      uid: params.userUID,
      lastActiveAt: new Date(),
    };

    await memberRef.doc(params.userUID).set(newMember);
    return;
  };

  create = async (params: SessionCreate): Promise<SessionResponse> => {
    const sessionParams: Partial<ISession> = {
      ...params,
      status: SessionStatus.Active,
    };

    const sessionRef = this.db
      .collection(SESSION_COLLECTION)
      .doc();
    const membersRef = this.db
      .collection(`${ SESSION_COLLECTION }/${ sessionRef.id }/members`);

    await sessionRef.set({
      ...sessionParams,
      createdAt: ServerTimestamp,
      updatedAt: ServerTimestamp,
    });

    await membersRef.doc(params.hostID).set(
      {
        uid: params.hostID,
        lastActiveAt: new Date(),
      }
    );

    return {
      session: {
        ID: sessionRef.id,
        status: SessionStatus.Active,
        hostID: params.hostID,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    };
  }
}

export default Session;
export type { SessionResponse };