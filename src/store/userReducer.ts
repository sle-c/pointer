interface UserState {
  UID?: string,
  name?: string,
}

interface Action {
  type: string,
  payload: { [key: string]: any },
}

function userReducer(state: UserState = {}, action: Action) {
  return state;
}

export default userReducer;