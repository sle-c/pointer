import React from "react";

import Logo from "../../components/logo";
import styles from "./styles.module.scss";

import ParticipantsCard from "./components/participants_card";
import FacilitatorCard from "./components/facilitator_card";
import RoomInfoCard from "./components/room_info_card";
import FacilitatorControl from "./components/facilitator_control";

const participants = [
  {
    name: "David",
    points: 1,
    hideVote: true,
  },
  {
    name: "Test",
    hideVote: true,
    points: 0,
  },
  {
    name: "John",
  },
  {
    name: "Mayer",
  },
  {
    name: "Tennesse",
  },
  {
    name: "Whisky",
  },
  {
    name: "Bunny",
  },
];

const SessionUI = () => {
  return (
    <div className={styles.sessionPage}>
      <Logo position="center"/>
      <div className="container">
        <div className="row">
          <div className="col-6">
            <ParticipantsCard participants={participants}/>
            <FacilitatorCard
              hostName="Amy"
            />
          </div>
          <div className="col-5 offset-1">
            <RoomInfoCard hostName="Amy" />
            <FacilitatorControl hostName="Amy" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionUI;

