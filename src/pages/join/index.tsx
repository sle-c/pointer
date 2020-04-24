import React, { useState, useEffect } from "react";
import { useParams, Redirect } from "react-router-dom";
import { connect, ConnectedProps } from 'react-redux'

import { RootState } from "../../store/store";

import Interactor from "./interactor";
import JoinUI from "./ui";


const mapState = (state: RootState) => ({
  session: state.session,
  members: state.members,
});

const connector = connect(mapState);

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux;

const getHostName = (props: Props): string => {
  const hostID = props.session.hostID;
  return props.members[hostID].name || "Unknown";
}

const Join = (props: Props) => {

  let { sessionID } = useParams();
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    if (sessionID) {
      Interactor
        .checkSession(sessionID)
        .then((valid: boolean) => {
          setValid(valid);
          setLoading(false);
        }).catch(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [sessionID]);

  if (loading) {
    return null;
  }

  if (valid && sessionID) {
    return (
      <JoinUI
        hostname={getHostName(props)}
        sessionID={sessionID}
      />
    );
  }

  return (
    <Redirect to="/fur-oh-fur" />
  );
};

export default connector(Join);