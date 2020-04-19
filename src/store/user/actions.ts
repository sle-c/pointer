import User from "../../domains/user";
import { UPDATE_USER, UserActionType } from "./types";

export function updateUser(user: User): UserActionType {
  return {
    type: UPDATE_USER,
    payload: user,
  }
};