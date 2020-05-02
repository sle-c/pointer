import firebase, { ServerTimestamp } from "../api/firebase";

const STATUS_COLLECTION = "statuses";

class PresenceService {
  private realtimeDB: firebase.database.Database;
  private db: firebase.firestore.Firestore;

  constructor() {
    this.realtimeDB = firebase.database();
    this.db = firebase.firestore();
  }

  ping(sessionID: string, userUID: string) {




  }

  setOnline = (sessionID: string, userUID: string) => {
    var userStatusRef = this.db
      .collection(`sessions/${ userUID }/${ STATUS_COLLECTION }`)
      .doc(userUID);

    var isOnlineForFirestore = {
      state: "online",
      last_changed: ServerTimestamp,
    };
  }

  setOffline = (sessionID: string, userUID: string) => {
    var userStatusRef = this.db
      .collection(`sessions/${ userUID }/${ STATUS_COLLECTION }`)
      .doc(userUID);

    var isOfflineForFirestore = {
      state: "offline",
      last_changed: ServerTimestamp,
    };
  }
}

export default PresenceService;