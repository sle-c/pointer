import Vote from "../../domains/vote";

export const UPDATE_VOTES = "UPDATE_VOTES";

interface UpdateVotesAction {
  type: typeof UPDATE_VOTES,
  payload: {
    votes: Vote[],
  };
}

export type VotesState = {
  [uid: string]: Vote
};

export type VoteActionType = UpdateVotesAction;