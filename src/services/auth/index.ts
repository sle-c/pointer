import { AuthClient } from "../api";
import User from "../../domains/user";
import AuthDomain from "../../domains/auth";
import UserService from "../users";

class Auth {
  private authClient: AuthClient;
  private userService: UserService;

  constructor() {
    this.authClient = new AuthClient();
    this.userService = new UserService();
  }

  isSignedIn(): boolean {
    return this.authClient.currentUser() !== null;
  }

  currentUser(): User | null {
    return this.authClient.currentUser();
  }

  signUpAnonymously(name: string) {
    return new Promise<User>((resolve, reject) => {
      const req = this.authClient.signInAnonymously(name);

      req.then((auth: AuthDomain) => {
        this.userService.update({
          UID: auth.UID,
          name: name,
        }).then((user) => {
          resolve({
            UID: auth.UID,
            name: user.user.name,
            verified: auth.verified,
            email: auth.email,
            isAnonymous: true,
          });
        }).catch(reject);
      }).catch(reject);
    });
  }

  onAuthStateChanged(callback: (user: User | null) => void) {
    this.authClient.onAuthStateChanged(callback);
  }
}

export default Auth;