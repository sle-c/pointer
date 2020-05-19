import Vote from "../../domains/vote";
import { UPDATE_VOTES, VoteActionType } from "./types";

export function updateVotes(votes: Vote[]): VoteActionType {
  return {
    type: UPDATE_VOTES,
    payload: {
      votes,
    },
  }
};