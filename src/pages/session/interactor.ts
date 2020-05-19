import isEmpty from "lodash/isEmpty";
import Session, { SessionResponse, MembersResponse } from "../../services/session";
import Auth from "../../services/auth";
import UserService from "../../services/users";
import VoteService, { VotesResponse } from "../../services/votes";

import store from "../../store/store";
import { updateSession } from "../../store/session/actions";
import { updateMembers } from "../../store/members/actions";
import { updateVotes } from "../../store/votes/actions";
import ISession, { SessionStatus } from "../../domains/session";

const sessionService = new Session();
const auth = new Auth();
const userService = new UserService();
const voteService = new VoteService();

async function checkSession(sessionID: string): Promise<boolean> {
  const sessionResp: SessionResponse | null = await sessionService.get(sessionID);

  if (sessionResp !== null) {
    const action = updateSession(sessionResp.session);
    store.dispatch(action);
    return true;
  }

  return false;
}

async function changeSessionStatus(sessionID: string, status: SessionStatus): Promise<boolean> {
  await sessionService.changeStatus({
    sessionID,
    status,
  });
  return false;
}

async function joinSessionNoAuth(sessionID: string): Promise<boolean> {
  const user = auth.currentUser();
  if (user) {

    await sessionService.join({
      sessionID: sessionID,
      userUID: user.UID,
    });

    return true;
  }

  return false;
}

function subscribeToMembers(sessionID: string): () => void {
  return sessionService.subscribeToMembers(
    sessionID,
    async (resp: MembersResponse) => {
      const { members, memberUIDs } = resp;
      const currentMembers = store.getState().members[sessionID] || {};
      let filterMembers: string[] = [];

      if (isEmpty(currentMembers)) {
        filterMembers = memberUIDs;
      } else {
        filterMembers = memberUIDs.filter((uid: string): boolean => {
          return isEmpty(currentMembers[uid]) || isEmpty(currentMembers[uid].name);
        });
      }

      const usersResponse = await userService.batchGet(filterMembers);
      const users = usersResponse.users;

      members.forEach((mem) => {
        if (users[mem.uid]?.name) {
          mem.name = users[mem.uid].name as string;
        }
      });

      store.dispatch(updateMembers(sessionID, members));
    }
  );
}

function subscribeToSession(sessionID: string): () => void {
  return sessionService.subscribe(sessionID, (sess: SessionResponse | null): void => {
    if (isEmpty(sess?.session)) {
      return;
    }
    store.dispatch(updateSession(sess?.session as ISession));
  });
}

function subscribeToVotes(sessionID: string): () => void {
  return voteService.subscribe(sessionID, (voteResp: VotesResponse) => {
    store.dispatch(updateVotes(voteResp.votes || []));
  });
}

function clearVotes(sessionID: string, memberUIDs: string[]) {
  return voteService.clear(sessionID, memberUIDs);
}

function createVote(sessionID: string, userUID: string, point: number) {
  return voteService.create({
    sessionID,
    userUID,
    point,
  });
}

export default {
  changeSessionStatus,
  checkSession,
  joinSessionNoAuth,
  subscribeToMembers,
  subscribeToSession,
  subscribeToVotes,
  clearVotes,
  createVote,
};