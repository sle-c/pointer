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
        const presenceUnsub = presenceService.ping(sessionID, this.props.user.UID);
        const membersUnsub = this.subscribeToMembers();

        this.unsub = () => {
          presenceUnsub();
          membersUnsub();
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
    const sessionID = this.props.match.params.sessionID;
    return Interactor.subscribeToMembers(sessionID);
  }

  renderParticipants(): Participant[] {
    const sessionID = this.props.match.params.sessionID;
    const currentMembers = this.props.members[sessionID] || {};

    if (isEmpty(currentMembers)) {
      return [];
    }

    return Object.values(currentMembers).reduce((memo: Participant[], mem) => {
      const hostID = this.props.session.hostID;
      if (mem.status === "online" && mem.uid !== hostID) {
        const participant = {
          name: mem.name as string,
          points: 0,
        }

        memo.push(participant);
      }

      return memo;
    }, []);
  }

  renderHostname(): string {
    const sessionID = this.props.match.params.sessionID;
    const hostID = this.props.session.hostID;
    const currentMembers = this.props.members[sessionID] || {};

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
        hostName={this.renderHostname()}
        participants={this.renderParticipants()}
        onSessionStatusChange={this.handleSessionStatusChange}
      />
    );
  }
}

export default connector(withRouter(SessionPage));