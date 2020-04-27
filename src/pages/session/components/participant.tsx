import React from "react";
import capitalize from "lodash/capitalize";
import styles from "./participant.module.scss";

interface Props {
  name: string,
  hideVote?: boolean,
  points?: number,
}

const renderVote = (props: Props) => {
  const hasPoints = props.points !== undefined && props.points > -1;
  const hasNoPoints = props.points === undefined || props.points < 0;

  if (props.hideVote && hasPoints) {
    return "Voted";
  } else if (props.hideVote && hasNoPoints) {
    return "-";
  } else if (!props.hideVote && hasPoints) {
    return props.points;
  } else {
    return "-";
  }
};

const renderVoteClass = (props: Props) => {
  if (props.points !== undefined && props.points > -1) {
    return styles.voted;
  } else {
    return "";
  }
};

const Participant = (props: Props) => {
  return (
    <div className={styles.participant}>
      <div className="row">
        <div className="col-8">
          <span className={styles.name}>
            {capitalize(props.name)}
          </span>
        </div>
        <div className="col-4">
          <span className={renderVoteClass(props)}>
            {renderVote(props)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Participant;