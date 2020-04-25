import Session, { SessionResponse } from "../../services/session";
import Auth from "../../services/auth";
import UserService from "../../services/users";

import User from "../../domains/user";
import Membership, { Role } from "../../domains/membership";

import store from "../../store/store";
import { updateUser } from "../../store/user/actions";
import { updateSession } from "../../store/session/actions";
import { updateMember } from "../../store/members/actions";

const sessionService = new Session();
const auth = new Auth();
const userService = new UserService();

async function checkSession(sessionID: string): Promise<boolean> {
  const sessionResp: SessionResponse | null = await sessionService.get(sessionID);

  if (sessionResp !== null) {
    const user = await userService.get(sessionResp.session.hostID);
    const member: Membership = {
      uid: user.user.UID,
      role: Role.host,
      name: user.user.name || "Unknown",
      lastActiveAt: new Date(),
    };

    const memberAction = updateMember(member);
    store.dispatch(memberAction);

    const action = updateSession(sessionResp.session);
    store.dispatch(action);
    return true;
  }

  return false;
}

async function joinSessionNoAuth(sessionID: string): Promise<boolean> {
  const user = auth.currentUser();
  if (user) {
    await _joinSesssion(sessionID, user.UID);
    return true;
  }

  return false;
}

async function joinSession(name: string, sessionID: string) {
  const user: User = await auth.signUpAnonymously(name);
  const action = updateUser(user);
  store.dispatch(action);
  return _joinSesssion(user.UID, sessionID);
};

async function _joinSesssion(userUID: string, sessionID: string) {
  await sessionService.join({
    sessionID,
    userUID,
  });
};

export default {
  joinSession,
  checkSession,
  joinSessionNoAuth,
};