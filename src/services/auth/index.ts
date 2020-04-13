import { AuthClient } from "../api";
import User from "../../domains/user";

class Auth {
  private authClient: AuthClient;

  constructor() {
    this.authClient = new AuthClient();
  }

  signUpAnonymously(name: string) {
    return new Promise<User>((resolve, reject) => {
      const req = this.authClient.signInAnonymously();

      req.then((user: User) => {
        this.authClient.updateUserInfo({
          name: name,
        }).then(() => {
          user.name = name;
          resolve(user);
        }).catch(reject);
      }).catch(reject);
    });
  }
}

export default Auth;