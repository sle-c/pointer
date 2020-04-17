import React from "react";
import { Route, Redirect } from "react-router-dom";

import Auth from "../../services/auth";

interface PropTypes {
  children: React.ReactChildren,
  rest: any,
};

const auth = new Auth();

const PrivateRoute = ({ children, ...rest }: PropTypes) => {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.currentUser() ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;