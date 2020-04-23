import Session, { SessionResponse } from "../../services/session";
import Auth from "../../services/auth";
import User from "../../domains/user";

import { updateUser } from "../../store/user/actions";
import { updateSession } from "../../store/session/actions";
import store from "../../store/store";

const sessionService = new Session();
const auth = new Auth();

async function joinSession(name: string, sessionID: string) {
  const user: User = await auth.signUpAnonymously(name);
  const action = updateUser(user);
  store.dispatch(action);
  return _joinSesssion(user.UID, sessionID);
};

async function _joinSesssion(userUID: string, sessionID: string) {
  const sess: SessionResponse = await sessionService.join({
    sessionID,
    userUID,
  });

  const action = updateSession(sess.session);
  store.dispatch(action);
};

export default {
  joinSession
};