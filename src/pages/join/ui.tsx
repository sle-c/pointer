import React from "react";

import Logo from "../../components/logo";
import JoinForm from "./join_form";
import styles from "./styles.module.scss";

const JoinUI = () => {
  return (
    <div className={styles.join}>
      <Logo position="center"/>

      <div className={styles.content}>
        <p className={styles.joinText}>
          You are invited to join <span className={styles.userName}>Amy's</span> room
        </p>

        <img
          className={styles.hero}
          src="https://firebasestorage.googleapis.com/v0/b/pointer-3906a.appspot.com/o/public%2Fimages%2Fprofile-cat.png?alt=media"
          alt="profile-cat"
        />

        <p className={styles.tagLine}>
          A (nick)name will help your fur-ends recognize you
        </p>

        <JoinForm />
      </div>
    </div>
  );
};

export default JoinUI;