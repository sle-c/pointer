import Membership from "../../domains/membership";

import { UPDATE_MEMBER, MemberActionType } from "./types";

export function updateMember(member: Membership): MemberActionType {
  return {
    type: UPDATE_MEMBER,
    payload: member,
  }
}