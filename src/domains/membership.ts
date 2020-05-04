interface Membership {
  uid: string,
  name?: string,
  lastActiveAt: Date,
  status?: "offline" | "online",
};

export default Membership;