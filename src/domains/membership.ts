enum Role {
  host = "host",
  member = "member",
}

interface Membership {
  uid: string,
  role: Role,
  lastActiveAt: Date,
};

export { Role };

export default Membership;