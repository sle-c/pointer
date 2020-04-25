import React, {
  useState, useEffect,
} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import Home from "./pages/home";
import Invite from "./pages/invite";
import Join from "./pages/join";
import FurOFur from "./pages/fur_o_fur";
import Session from "./pages/session";
import ScrollToTop from './components/scroll_top';

import Auth from "./services/auth";
import store from "./store/store";
import { updateUser } from "./store/user/actions";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

      setLoading(false);
    });
  }, []);

  if (loading) {
    return null;
  }

  return (
    <Router>
      <ScrollToTop/>
      <Switch>

        <Route path="/invite">
          <Invite />
        </Route>

        <Route path="/join/:sessionID">
          <Join />
        </Route>

        <Route path="/r/:sessionID">
          <Session />
        </Route>

        <Route exact path="/">
          <Home />
        </Route>

        <Route path="*">
          <FurOFur />
        </Route>
      </Switch>

    </Router>
  );
}

export default App;
