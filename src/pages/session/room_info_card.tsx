import React from "react";
import classNames from "classnames";

import styles from "./room_info_card_styles.module.scss";

interface Props {
  hostName: string,
};

const RoomInfoCard = (props: Props) => {

  const onTerminateClicked = () => {
    console.log("terminate");
  };

  return (
    <div className={styles.roomInfoCardContainer}>
      <div className={classNames(styles.roomInfoCard, styles.card)}>
        <div className={classNames(styles.cardHeader, styles.roomInfoCardHeader)}>
          <span role="img" aria-label="house-emoji">🏠</span><span> {props.hostName}'s Room</span>
        </div>

        <div className={classNames(styles.cardBody, styles.roomInfoBody)}>

          <div className={styles.formGroup}>
            <label>Room URL</label>
            <div className={styles.linkGroup}>
              <span className={styles.roomURL}>
                {window.location.href}
              </span>
              <span className={styles.copy}>Copy link</span>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Everything's finished?</label>
            <button className="btn btn-danger btn-xs" onClick={onTerminateClicked}>
              Terminate room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomInfoCard;