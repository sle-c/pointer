import React from "react";

import Logo from "../../components/logo";
import styles from "./styles.module.scss";

import ParticipantsCard from "./components/participants_card";
import FacilitatorCard from "./components/facilitator_card";
import RoomInfoCard from "./components/room_info_card";
import FacilitatorControl from "./components/facilitator_control";
import { Participant } from "./types";

interface Props {
  participants: Participant[],
  hostName?: string,
  onSessionStatusChange: () => void,
}

const SessionUI = (props: Props) => {
  return (
    <div className={styles.sessionPage}>
      <Logo position="center"/>
      <div className="container">
        <div className="row">
          <div className="col-6">
            <ParticipantsCard
              participants={props.participants}
            />
            <FacilitatorCard
              hostName={props.hostName || "Unknown"}
            />
          </div>
          <div className="col-5 offset-1">
            <RoomInfoCard hostName={props.hostName || "Unknown"} />
            <FacilitatorControl
              hostName={props.hostName || "Unknown"}
              onSessionStatusChange={props.onSessionStatusChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionUI;

