import {
  UPDATE_MEMBERS,
  UPDATE_MEMBER,
  MembershipState,
  MemberActionType
} from "./types";
import Membership from "../../domains/membership";
import getFromObject from "lodash/get";

const initialState: MembershipState = {};

export function membersReducer(state: MembershipState = initialState, action: MemberActionType): MembershipState {
  switch (action.type) {

    case UPDATE_MEMBERS: {
      const sessionID = action.payload.sessionID;
      const members = action.payload.members;
      const serializedMembers = members.reduce(
        (result: { [uid: string]: Membership}, member: Membership
      ) => {
        const currentMemberData = getFromObject(
          state,
          `${ sessionID }.${ member.uid }`,
          {},
        ) as Membership;

        result[member.uid] = {
          ...currentMemberData,
          ...member,
        };
        return result;
      }, {});

      return {
        ...state,
        [sessionID]: {
          ...state[sessionID] || {},
          ...serializedMembers,
        },
      };
    }

    case UPDATE_MEMBER: {
      const sessionID = action.payload.sessionID;
      const member = action.payload.member;

      return {
        ...state,
        [sessionID]: {
          ...state[sessionID] || {},
          [member.uid]: member,
        }
      }
    }

    default:
      return state;
  }
};