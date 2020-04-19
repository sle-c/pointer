import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import Home from "./pages/home";
import Invite from "./pages/invite";
import Join from "./pages/join";
import ScrollToTop from './components/scroll_top';
import Auth from "./services/auth";
import store from "./store/store";
import { updateUser } from "./store/user/actions";

const auth = new Auth();

auth.onAuthStateChanged((user): void => {
  const currentState = store.getState();
  if (currentState.user.UID !== "") {
    return;
  }

  if (user) {
    const action = updateUser(user);
    store.dispatch(action);
  }
});

function App() {
  return (
    <Router>
      <ScrollToTop/>
      <Switch>

        <Route path="/invite">
          <Invite />
        </Route>

        <Route path="/join">
          <Join />
        </Route>

        <Route path="/">
          <Home />
        </Route>
      </Switch>

    </Router>
  );
}

export default App;
