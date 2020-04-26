import React, { useState } from "react";
import classNames from "classnames";

import styles from "./room_info_card_styles.module.scss";

interface Props {
  hostName: string,
};

const RoomInfoCard = (props: Props) => {

  const onTerminateClicked = () => {
    console.log("terminate");
  };

  const [roomInfoClosed, setRoomInfoClosed] = useState(true);

  const onCollapseClicked = () => {
    console.log("collapsing");
    setRoomInfoClosed(!roomInfoClosed);
  };

  const dropDownIconClass = classNames(styles.dropDownIcon, { [styles.closed]: roomInfoClosed });
  const roomInfoBodyClass = classNames(styles.cardBody, styles.roomInfoBody, { [styles.closed]: roomInfoClosed });

  return (
    <div className={styles.roomInfoCardContainer}>
      <div className={classNames(styles.roomInfoCard, styles.card)}>
        <div className={classNames(styles.cardHeader, styles.roomInfoCardHeader)}>
          <p className={styles.headerTitle}>
            <span role="img" aria-label="house-emoji">🏠</span>
            <span> {props.hostName}'s Room</span>
          </p>
          <span className={dropDownIconClass} onClick={onCollapseClicked}>
            <i className="material-icons">arrow_drop_down</i>
          </span>
        </div>

        <div className={roomInfoBodyClass}>

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