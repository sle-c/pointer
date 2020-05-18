import React, { Component } from "react";
import { withRouter, RouteComponentProps } from "react-router";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../store/store";

import Presence from "../../services/presence";
import Interactor from "./interactor";
import SessionUI from "./ui";
import { SessionStatus } from "../../domains/session";
import { Participant } from "./types";
import isEmpty from "lodash/isEmpty";

const presenceService = new Presence();

type PathParams = {
  sessionID: string,
};

const mapState = (state: RootState, ownProps: RouteComponentProps<PathParams>) => {
  const sessionID = ownProps.match.params.sessionID;
  const members = state.members[sessionID];

  return {
    user: state.user,
    session: state.session,
    members: members,
  };
};

const connector = connect(mapState);

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & RouteComponentProps<PathParams>

type State = {
  loading: boolean,
};

class SessionPage extends Component<Props, State> {

  unsub: (() => void) | null;

  constructor(props: Props) {
    super(props);
    this.state = {
      loading: true,
    };
    this.unsub = null;
  }

  componentDidMount() {
    this.initSession().then(() => {
      this.setState({
        loading: false,
      });
    });
  }

  componentWillUnmount() {
    if (this.unsub) {
      this.unsub();
    }
  }

  handleSessionStatusChange = (status: SessionStatus) => {
    const sessionID = this.props.session.ID;

    Interactor.changeSessionStatus(
      sessionID,
      status,
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
        const presenceUnsub = presenceService.ping(sessionID, this.props.user.UID);
        const membersUnsub = this.subscribeToMembers();
        const sessionUnsub = this.subscribeToSession();

        this.unsub = () => {
          presenceUnsub();
          membersUnsub();
          sessionUnsub();
        };

        return true;
      }
    }

    this.props.history.push(
      `/join/${ sessionID }`,
      {
        referrer: "session",
      },
    );

    return false;
  }

  subscribeToMembers(): () => void {
    return Interactor.subscribeToMembers(this.props.session.ID);
  }

  subscribeToSession(): () => void {
    return Interactor.subscribeToSession(this.props.session.ID);
  }

  renderParticipants(): Participant[] {
    const currentMembers = this.props.members || {};

    if (isEmpty(currentMembers)) {
      return [];
    }

    return Object.values(currentMembers).reduce((memo: Participant[], mem) => {
      const hostID = this.props.session.hostID;
      if (mem.status === "online" && mem.uid !== hostID) {
        const participant = {
          name: mem.name as string,
          points: null,
        };

        memo.push(participant);
      }

      return memo;
    }, []);
  }

  renderHostname(): string {
    const hostID = this.props.session.hostID;
    const currentMembers = this.props.members || {};

    if (isEmpty(currentMembers)) {
      return "Unknown";
    }

    return currentMembers[hostID].name || "Unknown";
  }

  render() {
    if (this.state.loading) {
      return null;
    }

    return (
      <SessionUI
        user={this.props.user}
        members={this.props.members}
        session={this.props.session}
        hostName={this.renderHostname()}
        participants={this.renderParticipants()}
        onSessionStatusChange={this.handleSessionStatusChange}
      />
    );
  }
}

export default withRouter(connector(SessionPage));