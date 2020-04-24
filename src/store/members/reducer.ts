import {
  UPDATE_MEMBER,
  MembershipState,
  MemberActionType
} from "./types";

const initialState: MembershipState = {};

export function membersReducer(state: MembershipState = initialState, action: MemberActionType): MembershipState {
  switch (action.type) {
    case UPDATE_MEMBER:
      return {
        ...state,
        [action.payload.uid]: action.payload,
      };
    default:
      return state;
  }
};