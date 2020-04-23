import React from "react";
import { useParams, Redirect } from "react-router-dom";

import JoinUI from "./ui";

const Join = () => {
  let { sessionID } = useParams();
  if (sessionID) {
    return (
      <JoinUI sessionID={sessionID} />
    );
  }

  return (
    <Redirect to="/" />
  );
};

export default Join;