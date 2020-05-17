import React from "react";
import classNames from "classnames";

import styles from "./participants_card.module.scss";
import Participant from "./participant";
import { SessionStatus } from "../../../domains/session";
import { Participant as IParticipant } from "../types";


interface Props {
  participants: IParticipant[],
  sessionStatus: SessionStatus,
};

const EmptyList = () => (

  <div className={styles.emptyList}>
    <img
      src="https://firebasestorage.googleapis.com/v0/b/pointer-3906a.appspot.com/o/public%2Fimages%2Ffur-oh-fur-cat.png?alt=media"
      alt="four zero four cat"
    />
  </div>
);

const renderParticipants = (participants: IParticipant[], sessionStatus: SessionStatus) => {

  return participants.map((p, i) => (
    <Participant
      key={`participant-${i}`}
      sessionStatus={sessionStatus}
      name={p.name}
      points={p.points}
    />
  ));
};

const ParticipantsCard = (props: Props) => {
  return (
    <div className={styles.participantsCardContainer}>
      <div id={styles.customerServiceCat}>
        <img
          src="https://firebasestorage.googleapis.com/v0/b/pointer-3906a.appspot.com/o/public%2Fimages%2Fcustomer-service-cat.png?alt=media"
          alt="cat customer service"
        />
      </div>

      <div id={styles.catOnChart}>
        <img
          src="https://firebasestorage.googleapis.com/v0/b/pointer-3906a.appspot.com/o/public%2Fimages%2Fcat-on-chart.png?alt=media"
          alt="cat on chart"
        />
      </div>
      <div className={classNames(styles.participantsCard, styles.card)}>
        <div className={styles.cardHeader}>
          <div className="row">
            <div className="col-8">
              <span>PURR-TICIPANTS</span>
            </div>
            <div className="col-4">
              <span>STORY POINTS</span>
            </div>
          </div>
        </div>
        <div className={classNames(styles.cardBody, styles.participantCardBody)}>
          {
            props.participants.length > 0
              ? renderParticipants(props.participants, props.sessionStatus)
              : <EmptyList />
          }
        </div>
      </div>
    </div>

  );
};

export default ParticipantsCard;