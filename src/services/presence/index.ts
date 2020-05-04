import firebase, { ServerTimestamp, DBServerTimestamp } from "../api/firebase";
import { COLLECTION } from "../api/constants";

const isOnlineForDatabase = {
  state: "online",
  lastActiveAt: DBServerTimestamp,
};

const isOfflineForDatabase = {
  state: "offline",
  lastActiveAt: DBServerTimestamp,
}

const isOnlineForFirestore = {
  state: "online",
  lastActiveAt: ServerTimestamp,
};

const isOfflineForFirestore = {
  state: "offline",
  lastActiveAt: ServerTimestamp,
};

class PresenceService {
  private realtimeDB: firebase.database.Database;
  private db: firebase.firestore.Firestore;

  constructor() {
    this.realtimeDB = firebase.database();
    this.db = firebase.firestore();
  }

  ping(sessionID: string, userUID: string) {
    const userStatusDatabaseRef = firebase.database()
      .ref(`/${ COLLECTION.STATUS }/${sessionID}/${ userUID }`);

    const userStatusFirestoreRef = this.db
      .collection(`${ COLLECTION.SESSIONS }/${ sessionID }/${ COLLECTION.MEMBERS }`)
      .doc(userUID);

    const connectionRef = this.realtimeDB.ref(".info/connected");

    connectionRef.on("value", (snapshot) => {
      // we'll also set Firestore's state
      // to 'offline'. This ensures that our Firestore cache is aware
      // of the switch to 'offline.'
      if (snapshot.val() === false) {
        userStatusFirestoreRef.set(
          isOfflineForFirestore,
          { merge: true },
        );
        return;
      };

      userStatusDatabaseRef
        .onDisconnect()
        .set(isOfflineForDatabase)
        .then(() => {
          // The promise returned from .onDisconnect().set() will
          // resolve as soon as the server acknowledges the onDisconnect()
          // request, NOT once we've actually disconnected:
          // https://firebase.google.com/docs/reference/js/firebase.database.OnDisconnect

          // We can now safely set ourselves as 'online' knowing that the
          // server will mark us as offline once we lose connection.
          userStatusDatabaseRef.set(isOnlineForDatabase);
          // We'll also add Firestore set here for when we come online.
          userStatusFirestoreRef.set(
            isOnlineForFirestore,
            { merge: true },
          );
        });
    });

    const unsub = () => {
      connectionRef.off();
      userStatusDatabaseRef.onDisconnect().cancel();
      userStatusDatabaseRef.set(isOfflineForDatabase);
      userStatusFirestoreRef.set(isOfflineForFirestore);
    };

    return unsub;
  }
}

export default PresenceService;