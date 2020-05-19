import React from "react";
import classNames from "classnames";
import isEmpty from "lodash/isEmpty";

import styles from "./participant_control.module.scss";
import PointRadioGroup from "../../../components/point_radio_group";
import Membership from "../../../domains/membership";
import Vote from "../../../domains/vote";
import { SessionStatus } from "../../../domains/session";

interface Props {
  sessionStatus: SessionStatus,
  participant?: Membership,
  vote?: Vote,
  onPointSelected?: (point: number) => void,
};

const STORY_POINTS = [0, 1, 2, 3, 5, 8, 13, 21, 34];

const renderTitle = (props: Props) => {
  if (isEmpty(props.participant)) {
    return null;
  }

  switch (props.sessionStatus) {
    case SessionStatus.Active: {
      return (
        <h3 className={styles.title}>
          {props.participant?.name || "Unknown"}
        </h3>
      );
    }

    case SessionStatus.VoteStarted: {
      return (
        <h3 className={styles.voteTitle}>
          Voting has started
        </h3>
      );
    }

    case SessionStatus.VoteEnding: {
      return (
        <h3 className={styles.voteTitle}>
          Voting will end soon...
        </h3>
      );
    }

    case SessionStatus.VoteEnded: {
      return (
        <h3 className={classNames(styles.voteTitle, styles.success)}>
          The results are in!
        </h3>
      );
    }

    default:
      return null;
  }
};

const renderSubtitle = (props: Props) => {
  switch (props.sessionStatus) {
    case SessionStatus.Active: {
      return (
        <p className={styles.subtitle}>
          <span className={styles.emphasis}>We are waiting for the session to be started.</span> Everyone’s vote will be hidden until revealed.
        </p>
      );
    }

    case SessionStatus.VoteStarted: {
      return (
        <p className={styles.subtitle}>
          <span className={styles.emphasis}>Choose the number of points you think the story will take to complete.</span> All votes are hidden until revealed by the <i>fur-cilitator</i>.
        </p>
      );
    }

    case SessionStatus.VoteEnding: {
      return (
        <p className={styles.subtitle}>
          <span className={styles.emphasis}>Any last change should be made now!</span>
        </p>
      );
    }

    case SessionStatus.VoteEnded: {
      return (
        <p className={styles.subtitle}>
          <span className={styles.emphasis}>All votes have been revealed.</span>
        </p>
      );
    }

    default:
      return null;
  }
};

const renderActions = (props: Props) => {
  let disabled = props.sessionStatus === SessionStatus.Active;
  let readonly = props.sessionStatus === SessionStatus.VoteEnded;

  const selections = STORY_POINTS.map((point) => ({
    label: point,
    value: point,
  }));

  const onChange = (val: any) => {
    if (props.onPointSelected) {
      props.onPointSelected(val as number);
    }
  };

  return (
    <PointRadioGroup
      collection={selections}
      disabled={disabled}
      readonly={readonly}
      onChange={onChange}
      selectedValue={props.vote?.point}
    />
  );
};

const ParticipantControl = (props: Props) => {

  return (
    <div className={styles.participantControl}>
      {renderTitle(props)}
      {renderSubtitle(props)}
      <div className={styles.actions}>
        {renderActions(props)}
      </div>
    </div>
  );
};

export default ParticipantControl;