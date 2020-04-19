interface User {
  UID: string, // uuid of the user
  email?: string | null,
  name?: string | null,
  verified?: boolean,
  isAnonymous?: boolean,
}

export default User;