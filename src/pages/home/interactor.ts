import Auth from "../../services/auth";
import Session from "../../services/session";
import SessionDomain, { SessionStatus } from "../../domains/session";
import { updateUser } from "../../store/user/actions";
import { updateSession } from "../../store/session/actions";
import store from "../../store/store";
import User from "../../domains/user";

const session = new Session();
const auth = new Auth();

async function createSession(name: string): Promise<void> {
  const user: User = await auth.signUpAnonymously(name);
  const action = updateUser(user);
  store.dispatch(action);
  return saveSession(user);
}

async function saveSession(user: { UID: string }): Promise<void> {
  const sess: SessionDomain = await session.create({
    status: SessionStatus.Active,
    hostID: user.UID,
  })

  const action = updateSession(sess);
  store.dispatch(action);
  return Promise.resolve();
}

export default {
  createSession,
};