import User from "../../domains/user";

export const UPDATE_USER = "UPDATE_USER";

interface UpdateUserAction {
  type: typeof UPDATE_USER,
  payload: User,
}

export type UserState = {
  UID: string,
  name: string,
};

export type UserActionType = UpdateUserAction;