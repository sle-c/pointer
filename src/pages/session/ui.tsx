import React from "react";
import get from "lodash/get";

import Logo from "../../components/logo";
import ParticipantsCard from "./components/participants_card";
import FacilitatorCard from "./components/facilitator_card";
import RoomInfoCard from "./components/room_info_card";
import FacilitatorControl from "./components/facilitator_control";
import ParticipantControl from "./components/participant_control";

import Membership from "../../domains/membership";
import Session, { SessionStatus } from "../../domains/session";
import User from "../../domains/user";
import Vote from "../../domains/vote";

import { Participant } from "./types";

import styles from "./styles.module.scss";

interface Props {
  members: { [uid: string]: Membership },
  participants: Participant[],
  hostName?: string,
  session?: Session,
  user: User,
  votes: { [uid: string]: Vote },
  onSessionStatusChange: (status: SessionStatus) => void,
  onPointSelected: (point: number) => void,
}

const SessionUI = (props: Props) => {
  const sessionStatus = get(props.session, "status", SessionStatus.Active);

  const currentMembers = props.members || {};
  const currentVotes = props.votes || {};

  const membersCount = Object.values(currentMembers).filter(
    (mem) => mem.uid !== props.session?.hostID
  ).length;

  const currentMember = currentMembers[props.user.UID];
  const currentVote = currentVotes[props.user.UID];

  const renderControl = () => {
    const hostID = get(props.session, "hostID", null);

    if (props.user.UID === hostID) {
      return (
        <FacilitatorControl
          membersCount={membersCount}
          sessionStatus={sessionStatus}
          hostName={props.hostName || "Unknown"}
          onSessionStatusChange={props.onSessionStatusChange}
        />
      );
    }

    return (
      <ParticipantControl
        sessionStatus={sessionStatus}
        participant={currentMember}
        vote={currentVote}
        onPointSelected={props.onPointSelected}
      />
    );
  };

  return (
    <div className={styles.sessionPage}>
      <Logo position="center"/>
      <div className="container">
        <div className="row">
          <div className="col-6">
            <ParticipantsCard
              sessionStatus={sessionStatus}
              participants={props.participants}
            />
            <FacilitatorCard
              hostName={props.hostName || "Unknown"}
            />
          </div>
          <div className="col-5 offset-1">
            <RoomInfoCard hostName={props.hostName || "Unknown"} />
            {renderControl()}

          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionUI;

