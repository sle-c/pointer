import React from "react";
import { connect, ConnectedProps } from 'react-redux'

import InviteUI from "./invite";
import { RootState } from "../../store/store";
import { Redirect } from "react-router";

const mapState = (state: RootState) => ({
  user: state.user,
  session: state.session,
});

const connector = connect(mapState)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux;

const constructRoomURL = (session: { ID: string }): string => {
  return `${ window.location.origin }/join/${ session.ID }`;
};

const Invite = (props: Props) => {

  const copyLink = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
  };

  if (props.user.UID === "" || props.session.ID === "") {
    return (
      <Redirect to="/" />
    );
  }

  return (
    <InviteUI
      copyLink={copyLink}
      userName={props.user.name}
      roomURL={constructRoomURL(props.session)}
    />
  );
};

export default connector(Invite);