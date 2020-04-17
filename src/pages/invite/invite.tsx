import React from "react";
import Logo from "../../components/logo";
import styles from "./styles.module.scss";

interface PropTypes {
  roomURL: string,
  userName?: string | null,
  copyLink(e: React.MouseEvent<HTMLDivElement, MouseEvent>): void,
};

const InviteUI = (props: PropTypes) => {
  return (
    <div className={styles.invite}>
      <Logo position="center"/>

      <div className={styles.content}>
        <h1 className={styles.readyText}>
          <span className={styles.userName}>{props.userName}</span>, you room is ready!
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
          {props.roomURL}
        </p>

        <div className={styles.copyLink} onClick={props.copyLink}>
          Copy link
        </div>

        <a href={props.roomURL} className="btn btn-success">
          Take me to my room
        </a>
      </div>
    </div>
  );
};

export default InviteUI;