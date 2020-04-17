interface Auth {
  UID: string; // uuid of the session
  email?: string | null;
  verified?: boolean;
  isAnonymous?: boolean;
};

export default Auth;