import Session, { SessionStatus } from "../../domains/session";
import Membership from "../../domains/membership";

export const UPDATE_SESSION = "UPDATE_SESSION";

interface UpdateSessionAction {
  type: typeof UPDATE_SESSION,
  payload: Session,
}

export type SessionState = {
  ID: string,
  status: SessionStatus,
  hostID: string,
  members: {
    [k: string]: Membership,
  },
};

export type SessionActionType = UpdateSessionAction;