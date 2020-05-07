import Session, { SessionResponse } from "../../services/session";
import Auth from "../../services/auth";

import Membership from "../../domains/membership";

import store from "../../store/store";
import { updateSession } from "../../store/session/actions";
import { updateMember } from "../../store/members/actions";
import { SessionStatus } from "../../domains/session";

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

// should it receive what to change it too?
async function changeSessionStatus(sessionID: string, status: SessionStatus): Promise<boolean> {
  // should we just receive success here?
  await sessionService.changeStatus({
    sessionID,
    status,
  });
  // TODO: should we then dispatch action to update state of session
  // in redux or not, because maybe we will rely on the value of being subscribed to session?

  // check for errors?

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
  changeSessionStatus,
  checkSession,
  joinSessionNoAuth,
};