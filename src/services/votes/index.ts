import firebase, { ServerTimestamp } from "../api/firebase";
import { COLLECTION } from "../api/constants";
import IVote from "../../domains/vote";

type VoteCreate = {
  sessionID: string,
  userUID: string,
  point: number,
};

type VoteResponse = {
  vote: IVote,
};

type VotesResponse = {
  votes: IVote[]
};

class Vote {
  private db: firebase.firestore.Firestore;

  constructor() {
    this.db = firebase.firestore();
  }

  subscribe = (sessionID: string, onSuccess: (response: VotesResponse) => void) => {
    const votesRef = this.db.collection(
      `${ COLLECTION.SESSIONS}/${sessionID}/${COLLECTION.VOTES}`
    );

    const snapshotOptions = {
      // Listen for document metadata changes
      includeMetadataChanges: true,
    };

    const votes: IVote[] = [];

    return votesRef.onSnapshot(snapshotOptions, (querySnapshot: firebase.firestore.QuerySnapshot) => {

      if (querySnapshot.metadata.fromCache) {
        return;
      }

      querySnapshot.forEach((snapshot: firebase.firestore.QueryDocumentSnapshot) => {
        const voteData = snapshot.data();

        votes.push({
          ID: snapshot.id,
          point: voteData?.point as number,
          userUID: voteData?.userUID as string,
        })
      });

      onSuccess({ votes });
    });
  }

  create = async (params: VoteCreate): Promise<VoteResponse> => {
    const votesRef = this.db.collection(
      `${ COLLECTION.SESSIONS}/${params.sessionID}/${COLLECTION.VOTES}`
    );

    const voteRef = votesRef.doc(params.userUID);
    const vote: IVote = {
      ID: voteRef.id,
      userUID: params.userUID,
      point: params.point,
    };

    await voteRef.set({
      ...vote,
      createdAt: ServerTimestamp,
      updatedAt: ServerTimestamp,
    }, { merge: true });

    return {
      vote,
    };
  }

  clear = (sessionID: string, memberUIDs: string[]) => {
    const votesRef = this.db.collection(
      `${ COLLECTION.SESSIONS}/${sessionID}/${COLLECTION.VOTES}`
    );

    memberUIDs.forEach(async (memberUID) => {
      const ref = votesRef.doc(memberUID);
      await ref.update({ point: null });
    });
  }
}

export default Vote;
export type { VotesResponse };