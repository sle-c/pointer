enum SessionStatus {
  Active = "active",
  VoteStarted = "vote_started",
  VoteEnding = "vote_ending",
  VoteEnded = "vote_ended",
  Idle = "idle",
  Closed = "closed",
}

interface Session {
  ID: string, // uuid of the session
  status: SessionStatus,
  hostID: string,
  createdAt?: Date,
  updatedAt?: Date,
}

export { SessionStatus };

export default Session;