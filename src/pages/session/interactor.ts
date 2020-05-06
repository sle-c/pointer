import Session, { SessionResponse } from "../../services/session";
import Auth from "../../services/auth";

import Membership from "../../domains/membership";

import store from "../../store/store";
import { updateSession } from "../../store/session/actions";
import { updateMember } from "../../store/members/actions";

const sessionService = new Session();
const auth = new Auth();

async function checkSession(sessionID: string): Promise<boolean> {
  const sessionResp: SessionResponse | null = await sessionService.get(sessionID);

  if (sessionResp !== null) {
    const action = updateSession(sessionResp.session);
    store.dispatch(action);
    return true;
  }

  return false;
}

async function joinSessionNoAuth(sessionID: string): Promise<boolean> {
  const user = auth.currentUser();
  if (user) {

    await sessionService.join({
      sessionID: sessionID,
      userUID: user.UID,
    });

    const member: Membership = {
      uid: user.UID,
      name: user.name || "Unknown",
      lastActiveAt: new Date(),
    };
    const memberAction = updateMember(member);
    store.dispatch(memberAction);
    return true;
  }

  return false;
}

export default {
  checkSession,
  joinSessionNoAuth,
};