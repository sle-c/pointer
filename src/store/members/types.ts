import Membership from "../../domains/membership";

export const UPDATE_MEMBER = "UPDATE_MEMBER";

interface UpdateMemberAction {
  type: typeof UPDATE_MEMBER,
  payload: Membership,
}

export type MembershipState = {
  [k: string]: Membership,
};

export type MemberActionType = UpdateMemberAction;