import Membership from "../../domains/membership";

export const UPDATE_MEMBERS = "UPDATE_MEMBERS",
  UPDATE_MEMBER = "UPDATE_MEMBER";

interface UpdateMembersAction {
  type: typeof UPDATE_MEMBERS,
  payload: {
    sessionID: string,
    members: Membership[],
  },
}

interface UpdateMemberAction {
  type: typeof UPDATE_MEMBER,
  payload: {
    sessionID: string,
    member: Membership,
  },
}

export type MembershipState = {
  [sessionID: string]: {
    [memberUID: string]: Membership,
  },
};

export type MemberActionType = UpdateMembersAction | UpdateMemberAction;