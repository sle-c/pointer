import React, { useState, useEffect } from "react";
import { useParams, Redirect, useHistory } from "react-router-dom";
import { connect, ConnectedProps } from 'react-redux'

import { RootState } from "../../store/store";

import Interactor from "./interactor";
import JoinUI from "./ui";


const mapState = (state: RootState) => ({
  user: state.user,
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

const tryToJoinSession = async (sessionID: string, history: any) : Promise<boolean> => {
  const success = await Interactor.joinSessionNoAuth(sessionID);

  if (success) {
    history.push(`/r/${ sessionID }`, {
      from: "/join",
    });

    return true;
  }

  return false;
};

const Join = (props: Props) => {

  let { sessionID } = useParams();
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);

  useEffect(() => {

    Interactor
      .checkSession(sessionID as string)
      .then((valid: boolean) => {

        if (props.user.UID !== "" && valid) {
          tryToJoinSession(
            sessionID as string,
            history,
          ).then((success) => {
            if (!success)  {
              console.error("failed to join session");
            }
          });

        } else {
          setValid(valid);
          setLoading(false);
        }
      }).catch(() => {
        setLoading(false);
      });
  }, [sessionID, props.user, history]);

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