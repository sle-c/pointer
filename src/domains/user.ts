interface User {
  UID?: string; // uuid of the session
  email?: string | null;
  name?: string | null;
  verified?: boolean;
  isAnonymous?: boolean;
}

export default User;