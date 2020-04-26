import React from "react";
import classNames from "classnames";

import styles from "./participants_card_styles.module.scss";

const EmptyList = () => (

  <div className={styles.emptyList}>
    <img
      src="https://firebasestorage.googleapis.com/v0/b/pointer-3906a.appspot.com/o/public%2Fimages%2Ffur-oh-fur-cat.png?alt=media"
      alt="four zero four cat"
    />
  </div>
);

const ParticipantsCard = () => {
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
        <div className={styles.cardBody}>
          <EmptyList />
        </div>
      </div>
    </div>

  );
};

export default ParticipantsCard;