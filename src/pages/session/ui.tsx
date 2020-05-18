import React from "react";

import Logo from "../../components/logo";
import styles from "./styles.module.scss";

import ParticipantsCard from "./components/participants_card";
import FacilitatorCard from "./components/facilitator_card";
import RoomInfoCard from "./components/room_info_card";
import FacilitatorControl from "./components/facilitator_control";
import { Participant } from "./types";
import Session, { SessionStatus } from "../../domains/session";

import get from "lodash/get";
import Membership from "../../domains/membership";
import ParticipantControl from "./components/participant_control";
import User from "../../domains/user";

interface Props {
  members: { [uid: string]: Membership },
  participants: Participant[],
  hostName?: string,
  session?: Session,
  user: User,
  onSessionStatusChange: (status: SessionStatus) => void,
}

const SessionUI = (props: Props) => {
  const sessionStatus = get(props.session, "status", SessionStatus.Active);
  const currentMembers = props.members || {};
  const membersCount = Object.values(currentMembers).filter(
    (mem) => mem.uid !== props.session?.hostID
  ).length;
  const currentMember = currentMembers[props.user.UID];

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
            <FacilitatorControl
              membersCount={membersCount}
              sessionStatus={sessionStatus}
              hostName={props.hostName || "Unknown"}
              onSessionStatusChange={props.onSessionStatusChange}
            />
            <ParticipantControl
              sessionStatus={sessionStatus}
              participant={currentMember}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionUI;

