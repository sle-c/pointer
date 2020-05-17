import firebase, { ServerTimestamp } from "../api/firebase";
import { COLLECTION } from "../api/constants";
import ISession, { SessionStatus } from "../../domains/session";
import Membership from "../../domains/membership";

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

interface MembersResponse {
  members: Membership[],
  memberUIDs: string[],
}

// TODO: maybe SessionSetStatus is a better name?
interface SessionChangeStatus {
  sessionID: string,
  status: string,
}

class Session {
  private db: firebase.firestore.Firestore;

  constructor() {
    this.db = firebase.firestore();
  }

  subscribe = (sessionID: string, callback: (sess: SessionResponse | null) => void): () => void =>  {
    const sessionRef = this.db.doc(`${ COLLECTION.SESSIONS }/${ sessionID }`);

    return sessionRef.onSnapshot((snapshot) => {
      if (!snapshot.exists) {
        callback(null);
      }

      if (!snapshot.metadata.hasPendingWrites) {
        const sessionData = snapshot.data();

        if (sessionData) {
          const resp: SessionResponse = {
            session: {
              ID: snapshot.id,
              status: sessionData.status as SessionStatus,
              hostID: sessionData.hostID as string,
              createdAt: sessionData.createdAt.toDate() as Date,
              updatedAt: sessionData.updatedAt.toDate() as Date,
            },
          };

          callback(resp);
        } else {
          callback(null);
        }
      }
    });
  }

  subscribeToMembers = (sessionID: string, onSuccess: (response: MembersResponse) => void): () => void => {
    const membersRef = this.db.collection(
      `${ COLLECTION.SESSIONS }/${ sessionID }/${ COLLECTION.MEMBERS }`
    );

    return membersRef.onSnapshot((querySnapshot: firebase.firestore.QuerySnapshot) => {
      const members: Membership[] = [];
      const memberUIDs: string[] = [];
      if (querySnapshot.metadata.fromCache) {
        return;
      }

      if (querySnapshot.metadata.hasPendingWrites) {
        return;
      }

      querySnapshot.forEach((snapshot: firebase.firestore.QueryDocumentSnapshot): void => {
        const memberData = snapshot.data();

        memberUIDs.push(memberData.uid as string);

        members.push({
          uid: memberData.uid as string,
          lastActiveAt: memberData.lastActiveAt?.toDate(),
          status: memberData.state as ('online' | 'offline'),
        });
      });

      onSuccess({
        members,
        memberUIDs,
      });
    });
  }

  get = async (sessionID: string): Promise<SessionResponse | null> => {
    const sessionRef = this.db.doc(`${ COLLECTION.SESSIONS }/${ sessionID }`);
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
      `${ COLLECTION.SESSIONS }/${ params.sessionID }/${ COLLECTION.MEMBERS }`
    );

    const newMember = {
      uid: params.userUID,
      lastActiveAt: new Date(),
    };

    await memberRef.doc(params.userUID).set(newMember);
    return;
  };

  changeStatus = async (params: SessionChangeStatus): Promise<void> => {
    this.db.collection(COLLECTION.SESSIONS)
      .doc(params.sessionID)
      .set({
        status: params.status,
      }, { merge: true })
      .catch((error: any) => {
        console.error("Error writing document: ", error);
      });
  }

  create = async (params: SessionCreate): Promise<SessionResponse> => {
    const sessionParams: Partial<ISession> = {
      ...params,
      status: SessionStatus.Active,
    };

    const sessionRef = this.db
      .collection(COLLECTION.SESSIONS)
      .doc();
    const membersRef = this.db
      .collection(`${ COLLECTION.SESSIONS }/${ sessionRef.id }/${ COLLECTION.MEMBERS }`);

    await sessionRef.set({
      ...sessionParams,
      createdAt: ServerTimestamp,
      updatedAt: ServerTimestamp,
    });

    await membersRef.doc(params.hostID).set(
      {
        uid: params.hostID,
        lastActiveAt: new Date(),
        status: "online",
      },
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
export type { SessionResponse, MembersResponse };