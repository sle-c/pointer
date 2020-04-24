enum Role {
  host = "host",
  member = "member",
}

interface Membership {
  uid: string,
  role: Role,
  name?: string,
  lastActiveAt: Date,
};

export { Role };

export default Membership;