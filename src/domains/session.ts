import Membership from "./membership";

enum SessionStatus {
  Active = "active",
  VoteStarted = "vote_started",
  VoteEnded = "vote_ended",
  Idle = "idle",
  Closed = "closed",
}

interface Session {
  ID: string, // uuid of the session
  status: SessionStatus,
  hostID: string,
  members: {
    [k: string]: Membership,
  },
  createdAt?: Date,
  updatedAt?: Date,
}

export { SessionStatus };

export default Session;