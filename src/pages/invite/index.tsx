import React from "react";
import InviteUI from "./invite";
import { useLocation } from "react-router-dom";
import User from "../../domains/user";
import Session from "../../domains/session";

interface LocationState {
  user: User,
  session: Session,
}

const constructRoomURL = (session: Session): string => {
  return `${ window.location.origin }/r/${ session.ID }`;
};

const Invite = () => {
  const location = useLocation();
  const {
    user,
    session,
  }= location.state as LocationState;

  const copyLink = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
  };

  return (
    <InviteUI
      copyLink={copyLink}
      userName={user.name}
      roomURL={constructRoomURL(session)}
    />
  );
};

export default Invite;