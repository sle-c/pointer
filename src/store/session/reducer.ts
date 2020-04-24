import {
  UPDATE_SESSION,
  SessionState,
  SessionActionType
} from "./types";
import { SessionStatus } from "../../domains/session";

const initialState: SessionState = {
  ID: "",
  status: SessionStatus.Closed,
  hostID: "",
};

export function sessionReducer(state: SessionState = initialState, action: SessionActionType): SessionState {
  switch (action.type) {
    case UPDATE_SESSION:
      return action.payload;
    default:
      return state;
  }
};