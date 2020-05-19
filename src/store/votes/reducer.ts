import isEmpty from "lodash/isEmpty";
import Vote from "../../domains/vote";
import {
  UPDATE_VOTES,
  VotesState,
  VoteActionType
} from "./types";

const initialState: VotesState = {};

export function votesReducer(state: VotesState = initialState, action: VoteActionType): VotesState {
  switch (action.type) {
    case UPDATE_VOTES: {
      const { votes } = action.payload;

      // for clearing votes between sessions
      if (isEmpty(votes)) {
        return {};
      }

      const serializedVotes = votes.reduce(
        (result: { [uid: string]: Vote }, vote: Vote) => {
          result[vote.userUID] = vote;
          return result;
        },
        {},
      );

      return {
        ...state,
        ...serializedVotes,
      };
    }
    default:
      return state;
  }
};