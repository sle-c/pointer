import Session from "../../domains/session";

import { UPDATE_SESSION, SessionActionType } from "./types";

export function updateSession(session: Session): SessionActionType {
  return {
    type: UPDATE_SESSION,
    payload: session,
  }
}