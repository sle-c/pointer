import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import { userReducer } from "./user/reducer";
import { sessionReducer } from './session/reducer';
import { membersReducer } from './members/reducer';

const rootReducer = combineReducers({
  user: userReducer,
  session: sessionReducer,
  members: membersReducer,
});

const logger = (store: any) => (next: any) => (action: any) => {
  // console.log('dispatching', action)
  let result = next(action)
  // console.log('next state', store.getState())
  return result;
};

const store = createStore(
  rootReducer,
  composeWithDevTools(
    applyMiddleware(logger),
  ),
);

export default store;
export type RootState = ReturnType<typeof rootReducer>