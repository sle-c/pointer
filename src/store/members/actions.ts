import Membership from "../../domains/membership";

import { UPDATE_MEMBER, UPDATE_MEMBERS, MemberActionType } from "./types";

export function updateMembers(sessionID: string, members: Membership[]): MemberActionType {
  return {
    type: UPDATE_MEMBERS,
    payload: {
      sessionID: sessionID,
      members: members,
    },
  }
};

export function updateMember(sessionID: string, member: Membership): MemberActionType {
  return {
    type: UPDATE_MEMBER,
    payload: {
      sessionID: sessionID,
      member: member,
    },
  }
};