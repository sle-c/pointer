import React, { useState } from "react";

import Logo from "../../components/logo";
import styles from "./styles.module.scss";

const Join = () => {
  const [name, setName] = useState("");

  const onNameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

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

        <form id={styles.roomForm} onSubmit={onSubmit}>
          <input
            name="name"
            value={name}
            onChange={onNameChanged}
            type="text"
            placeholder="Your name, please"
          />

          <input
            type="submit"
            className="btn btn-success"
            value="Join room"
          />
        </form>
      </div>
    </div>
  );
};

export default Join;