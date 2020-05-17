import React from "react";
import pluralize from "pluralize";
import classNames from "classnames";

import styles from "./facilitator_control.module.scss";
import { SessionStatus } from "../../../domains/session";

interface Props {
  hostName: string,
  membersCount: number,
  sessionStatus: SessionStatus,
  onSessionStatusChange: (status: SessionStatus) => void,
};

const handleChangeSessionStatus = (status: SessionStatus, onSessionStatusChanged: (status: SessionStatus) => void) => {

  return (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    e.preventDefault();
    onSessionStatusChanged(status);
  }
};

const renderTitle = (props: Props) => {
  switch (props.sessionStatus) {
    case SessionStatus.Active: {
      return (
        <h3 className={styles.title}>
          {props.hostName},
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
      if (props.membersCount < 1) {
        return (
          <p className={styles.subtitle}>
            <span className={styles.emphasis}>The room is empty...</span> Let’s wait for your fur-ends to join before we begin to vote on the Story Points.
          </p>
        );
      }

      return (
        <p className={styles.subtitle}>
          <span className={styles.emphasis}>{props.membersCount} {pluralize("person", props.membersCount)} {pluralize("has", props.membersCount)} joined!</span> You can start voting on the Story Points at any meow-ment now.
        </p>
      );
    }
    case SessionStatus.VoteStarted:
    case SessionStatus.VoteEnding: {
      return (
        <p className={styles.subtitle}>
          Votes from others will be hidden publicly until revealed by the fur-cilitator.
        </p>
      );
    }

    case SessionStatus.VoteEnded: {
      return (
        <p className={styles.subtitle}>
          <span className={styles.emphasis}>All votes are revealed.</span> To go back to lobby, choose End vote. To vote on this Story again, choose Revote.
        </p>
      );
    }

    default:
      return null;
  }
};

const renderActions = (props: Props) => {

  switch (props.sessionStatus) {
    case SessionStatus.Active: {
      const clicked = handleChangeSessionStatus(
        SessionStatus.VoteStarted,
        props.onSessionStatusChange,
      );

      return (
        <button
          className="btn btn-success btn-sm"
          onClick={clicked}
          disabled={props.membersCount < 1}
        >
            Start Voting
        </button>
      );
    }

    case SessionStatus.VoteStarted: {
      const clicked = handleChangeSessionStatus(
        SessionStatus.VoteEnding,
        props.onSessionStatusChange,
      );

      return (
        <button
          className="btn btn-success btn-sm"
          onClick={clicked}
          disabled={props.membersCount < 1}
        >
            Reveal
        </button>
      );
    }

    case SessionStatus.VoteEnding: {
      const clicked = handleChangeSessionStatus(
        SessionStatus.VoteEnded,
        props.onSessionStatusChange,
      );

      return (
        <button
          className="btn btn-success btn-sm"
          onClick={clicked}
          disabled={props.membersCount < 1}
        >
            End Now
        </button>
      );
    }

    case SessionStatus.VoteEnded: {
      const clicked = handleChangeSessionStatus(
        SessionStatus.Active,
        props.onSessionStatusChange,
      );

      return (
        <button
          className="btn btn-success btn-sm"
          onClick={clicked}
          disabled={props.membersCount < 1}
        >
            End Vote
        </button>
      );
    }

    default:
      return null;
  }
};

const FacilitatorControl = (props: Props) => {
  return (
    <div className={styles.facilitatorControlContainer}>
      <div className={styles.announcement}>
        {renderTitle(props)}
        {renderSubtitle(props)}

        <div className={styles.actions}>
          {renderActions(props)}
        </div>
      </div>
    </div>
  );
};

export default FacilitatorControl;