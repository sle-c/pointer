import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { withRouter, RouteComponentProps } from "react-router";
import { connect, ConnectedProps } from "react-redux";

import { RootState } from "../../store/store";

import getInObject from "lodash/get";
import Interactor from "./interactor";
import JoinUI from "./ui";

const mapState = (state: RootState) => ({
  user: state.user,
  session: state.session,
  members: state.members,
});

const connector = connect(mapState);

type PropsFromRedux = ConnectedProps<typeof connector>

type PathParams = {
  sessionID: string,
};

type Props = PropsFromRedux & RouteComponentProps<PathParams>;

interface States {
  loading: boolean,
  valid: boolean,
};

class Join extends Component<Props, States> {
  constructor(props: Props) {
    super(props);
    this.state = {
      valid: false,
      loading: true,
    };
  }

  componentDidMount() {
    const sessionID = this.props.match.params.sessionID;
    Interactor
      .checkSession(sessionID)
      .then((valid: boolean) => {

        if (this.props.user.UID !== "" && valid) {
          this.tryToJoinSession(
            sessionID,
            this.props.history,
          ).then((success) => {
            if (!success)  {
              console.error("failed to join session");
            }
          });

        } else {
          this.setState({
            valid: valid,
            loading: false,
          });
        }
      }).catch(() => {
        this.setState({
          loading: false,
        });
      });
  }

  getHostName = (): string => {
    const { hostID, ID} = this.props.session;
    const currentMembers = this.props.members;
    return getInObject(currentMembers, `${ ID }.${ hostID }.name`, "Unknown") as string;
  }

  tryToJoinSession = async (sessionID: string, history: any) : Promise<boolean> => {
    const success = await Interactor.joinSessionNoAuth(sessionID);

    if (success) {
      history.push(`/r/${ sessionID }`, {
        from: "/join",
      });

      return true;
    }

    return false;
  };

  render() {
    const sessionID = this.props.match.params.sessionID;

    if (this.state.loading) {
      return null;
    }

    if (this.state.valid && sessionID) {
      return (
        <JoinUI
          hostname={this.getHostName()}
          sessionID={sessionID}
        />
      );
    }

    return (
      <Redirect to="/fur-oh-fur" />
    );
  }
}

export default withRouter(connector(Join));