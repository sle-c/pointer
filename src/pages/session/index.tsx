import React, { Component } from "react";
import { withRouter, RouteComponentProps } from "react-router";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../store/store";

import Presence from "../../services/presence";
import Interactor from "./interactor";
import SessionUI from "./ui";
import { SessionStatus } from "../../domains/session";

const presenceService = new Presence();

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

type Props = PropsFromRedux & RouteComponentProps<PathParams>

type State = {
  loading: boolean,
};

class SessionPage extends Component<Props, State> {

  presenceUnsub: (() => void) | null;

  constructor(props: Props) {
    super(props);
    this.state = {
      loading: true,
    };
    this.presenceUnsub = null;
  }

  componentDidMount() {
    this.initSession().then(() => {
      this.setState({
        loading: false,
      });
    });
  }

  componentWillUnmount() {
    if (this.presenceUnsub) {
      this.presenceUnsub();
    }
  }

  handleSessionStatusChange = () => {
    const sessionID = this.props.match.params.sessionID;
    // TODO: maybe we need something to figure out next state? temporarily hardcode
    Interactor.changeSessionStatus(
      sessionID,
      SessionStatus.Active,
    );
  }

  async initSession(): Promise<boolean> {
    const sessionID = this.props.match.params.sessionID;

    const sessionValid = await Interactor.checkSession(sessionID);

    if (!sessionValid) {
      this.props.history.push("/fur-oh-fur");
      return false;
    }

    if (this.props.user.UID !== "") {
      const joinSuccess = await Interactor.joinSessionNoAuth(sessionID);
      if (!joinSuccess) {
        console.error("Failed to join session");
        this.props.history.push("/fur-oh-fur");
        return false;
      } else {
        this.presenceUnsub = presenceService.ping(sessionID, this.props.user.UID);
      }
    } else {
      this.props.history.push(
        `/join/${ sessionID }`,
        {
          referrer: "session",
        },
      );

      return false;
    }

    return true;
  }

  render() {
    if (this.state.loading) {
      return null;
    }

    return (
      <SessionUI 
        onSessionStatusChange={this.handleSessionStatusChange}
      />
    );
  }
}

export default connector(withRouter(SessionPage));