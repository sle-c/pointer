import Session, { SessionStatus } from "../../domains/session";

export const UPDATE_SESSION = "UPDATE_SESSION";

interface UpdateSessionAction {
  type: typeof UPDATE_SESSION,
  payload: Session,
}

export type SessionState = {
  ID: string,
  status: SessionStatus,
  hostID: string
};

export type SessionActionType = UpdateSessionAction;