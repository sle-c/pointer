import AuthClient from "../api";
class Auth {
  private authClient: AuthClient;
  constructor() {
    this.authClient = new AuthClient();
  }
}

export default Auth;