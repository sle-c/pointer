enum SessionStatus {
  Active = "active",
  Idle = "idle",
  Closed = "closed",
}

interface Session {
  ID: string; // uuid of the session
  status: SessionStatus;
  hostID: string;
  createdAt: Date;
  updatedAt: Date;
}

export { SessionStatus };

export default Session;