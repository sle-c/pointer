import React from "react";

import Logo from "../../components/logo";
import styles from "./styles.module.scss";

const Invite = () => {

  const copyLink = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
  };

  return (
    <div className={styles.invite}>
      <Logo position="center"/>

      <div className={styles.content}>
        <h1 className={styles.readyText}>
          <span className={styles.userName}>Amy</span>, you room is ready!
        </h1>

        <img
          className={styles.hero}
          src="https://firebasestorage.googleapis.com/v0/b/pointer-3906a.appspot.com/o/public%2Fimages%2Fdoor-cat.png?alt=media"
          alt="cat-door-hole"
        />

        <p className={styles.tagLine}>
          Your <i>fur-ends</i> can now use this URL to join you
        </p>

        <p className={styles.link}>
          https://pointers.to/room/216312
        </p>

        <div className={styles.copyLink} onClick={copyLink}>
          Copy link
        </div>

        <a href="https://pointers.to/room/216312" className="btn btn-success">
          Take me to my room
        </a>
      </div>
    </div>
  );
};

export default Invite;