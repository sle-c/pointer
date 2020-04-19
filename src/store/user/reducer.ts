import {
  UPDATE_USER,
  UserState,
  UserActionType
} from "./types";

const initialState: UserState = {
  UID: "",
  name: "",
};

export function userReducer(state: UserState = initialState, action: UserActionType): UserState {
  switch (action.type) {
    case UPDATE_USER:
      return {
        UID: action.payload.UID,
        name: action.payload.name as string,
      };
    default:
      return state;
  }
};