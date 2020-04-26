import React from "react";

import Logo from "../../components/logo";
import styles from "./styles.module.scss";

import ParticipantsCard from "./participants_card";
import FacilitatorCard from "./facilitator_card";
import RoomInfoCard from "./room_info_card";

const SessionUI = () => {
  return (
    <div className={styles.sessionPage}>
      <Logo position="center"/>
      <div className="container">
        <div className="row">
          <div className="col-6">
            <ParticipantsCard />
            <FacilitatorCard
              hostName="Amy"
            />
          </div>
          <div className="col-5 offset-1">
            <RoomInfoCard hostName="Amy" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionUI;

