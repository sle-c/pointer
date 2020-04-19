import React from "react";
import { useParams, Redirect } from "react-router-dom";

import JoinUI from "./ui";

const Join = () => {
  let { roomID } = useParams();
  if (roomID) {
    return (
      <JoinUI roomID={roomID} />
    );
  }

  return (
    <Redirect to="/" />
  );
};

export default Join;