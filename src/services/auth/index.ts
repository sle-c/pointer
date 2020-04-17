import { AuthClient } from "../api";
import User from "../../domains/user";
import UserService from "../users";

class Auth {
  private authClient: AuthClient;
  private userService: UserService;

  constructor() {
    this.authClient = new AuthClient();
    this.userService = new UserService();
  }

  currentUser() {
    return this.authClient.currentUser();
  }

  signUpAnonymously(name: string) {
    return new Promise<User>((resolve, reject) => {
      const req = this.authClient.signInAnonymously();

      req.then((user: User) => {
        this.userService.update({
          uid: user.UID,
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