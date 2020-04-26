import React from "react";
import classNames from "classnames";

import styles from "./facilitator_card_styles.module.scss";

interface Props {
  hostName: string,
};

const FacilitatorCard = (props: Props) => {
  return (
    <div className={styles.facilitatorCardContainer}>
      <div id={styles.leoCat}>
        <img
          src="https://firebasestorage.googleapis.com/v0/b/pointer-3906a.appspot.com/o/public%2Fimages%2Fleo-cat.png?alt=media&"
          alt="lion cat"
        />
      </div>

      <div className={classNames(styles.card, styles.facilitatorCard)}>
        <div className={styles.cardHeader}>
          <div className="row">
            <div className="col-12">
              <span>FUR-CILITATOR</span>
            </div>
          </div>
        </div>

        <div className={styles.cardBody}>
          <div className={styles.facilitatorRow}>
            <span>{props.hostName}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacilitatorCard;