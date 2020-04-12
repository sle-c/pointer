import React, { useState } from "react";

import Session from "../../services/session";
import { SessionStatus } from "../../domains/session";
import styles from "./styles.module.scss";

const session = new Session();

const createSession = (name: string) => {
  session.create({
    status: SessionStatus.Active,
    hostID: "test",
  });
};

const Home = () => {
  const [nameInput, setNameInput] = useState("");

  const onNameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameInput(e.target.value);
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createSession(nameInput);
  };

  return (
    <div className={styles.home}>
      <h1 className={styles.header}>
        POINTER
      </h1>

      <h2 className={styles.subheader}>
        Story Points for Remote Agile Teams
      </h2>

      <form onSubmit={onSubmit}>
        <input
          name="name"
          value={nameInput}
          onChange={onNameChanged}
          type="text"
        />
        <input
          type="submit"
          value="Create room"
        />
      </form>
    </div>
  );
};

export default Home;