import React from "react";

import Logo from "../../components/logo";
import RoomForm from "./room_form";
import styles from "./styles.module.scss";

const HomeUI = () => {
  return (
    <div className={styles.home}>
      <div className="container">
        <div className={styles.header}>
          <Logo size="md" />
        </div>

        <img
          id={styles.laptopCat}
          src="https://firebasestorage.googleapis.com/v0/b/pointer-3906a.appspot.com/o/public%2Fimages%2Flaptop-cat.png?alt=media"
          alt="laptop-cat"
        />
        <img
          id={styles.chartCat}
          src="https://firebasestorage.googleapis.com/v0/b/pointer-3906a.appspot.com/o/public%2Fimages%2Fchart-cat.png?alt=media"
          alt="chart-cat"
        />
        <img
          id={styles.toiletCat}
          src="https://firebasestorage.googleapis.com/v0/b/pointer-3906a.appspot.com/o/public%2Fimages%2Ftoilet-cat.png?alt=media"
          alt="toilet-cat"
        />

        <div className={styles.heroContent}>
          <div className={styles.left}>
            <h3 className={styles.subheader}>
              Agile Story Points <br/>
              - for Remote Teams
            </h3>
            <p className={styles.tagLine}>
              Host your room, invite others to join and go to town on the Story Points <span role="img" aria-label="rocket">🚀🚀🚀</span>
            </p>
            <RoomForm />
            <p className={styles.subtext}>
              No Signup needed, litter-ally
            </p>
          </div>
          <div className={styles.right}>
            <img
              src="https://firebasestorage.googleapis.com/v0/b/pointer-3906a.appspot.com/o/public%2Fimages%2Fhero.png?alt=media"
              alt="hero"
            />
          </div>
        </div>
      </div>


    </div>
  );
};

export default HomeUI;