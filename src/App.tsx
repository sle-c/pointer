import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import Home from "./pages/home";
import Invite from "./pages/invite";
import Join from "./pages/join";

function App() {
  return (
    <Router>
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
