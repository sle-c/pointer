import React from "react";
import capitalize from "lodash/capitalize";
import styles from "./participant_styles.module.scss";

interface Props {
  name: string,
  points?: number,
}

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
          {props.points || "-"}
        </div>
      </div>
    </div>
  );
};

export default Participant;