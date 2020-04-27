import React from "react";

import styles from "./facilitator_control.module.scss";

interface Props {
  hostName: string,
};

const renderSubtitle = (props: Props) => {
  return "The room is empty... Let’s wait for your fur-ends to join before we begin to vote on the Story Points.";
};

const FacilitatorControl = (props: Props) => {
  return (
    <div className={styles.facilitatorControlContainer}>
      <div className={styles.announcement}>
        <h3 className={styles.title}>
          {props.hostName},
        </h3>
        <p className={styles.subtitle}>
          {renderSubtitle(props)}
        </p>
        <button className="btn btn-success btn-sm">
          Start Voting
        </button>
      </div>
    </div>
  );
};

export default FacilitatorControl;