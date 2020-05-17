import React from "react";
import capitalize from "lodash/capitalize";
import styles from "./participant.module.scss";
import { SessionStatus } from "../../../domains/session";

interface Props {
  name: string,
  sessionStatus: SessionStatus
  points?: number | null,
}

const renderVote = (props: Props): string | number => {
  const pointsExists = props.points !== null && props.points !== undefined;
  const shouldShowVote = props.sessionStatus === SessionStatus.VoteEnded;

  if (!pointsExists) {
    return "-";
  }

  if (pointsExists && !shouldShowVote) {
    return "Voted";
  } else if (pointsExists && shouldShowVote) {
    return props.points as number;
  }

  return "-";
};

const renderVoteClass = (props: Props) => {
  const pointsExists = props.points !== null && props.points !== undefined;
  if (pointsExists && (props.points as number) > -1) {
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