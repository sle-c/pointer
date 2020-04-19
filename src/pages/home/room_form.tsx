import React, { useState } from "react";
import classNames from "classnames";
import { useHistory } from "react-router-dom";

import Interactor from "./interactor";

import styles from "./room_form.module.scss";

interface ErrorState {
  name?: string,
};

const RoomForm = () => {

  const [nameInput, setNameInput] = useState("");
  const [err, setErr] = useState<ErrorState>({});

  const history = useHistory();

  const onNameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameInput(e.target.value);
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErr({});

    if (nameInput.trim() === "") {
      setErr({
        name: "Name is required",
      });
      return;
    }

    Interactor.createSession(nameInput).then(() => {
      const location = {
        pathname: "/invite",
        state: {
          from: "home",
        },
      };

      history.push(location);
    });
  };

  return (
    <form id={styles.roomForm} onSubmit={onSubmit}>
      <div className={styles.inputGroup}>
        <input
          name="name"
          className={classNames(styles.input, { [styles.invalid]: err.name })}
          value={nameInput}
          onChange={onNameChanged}
          type="text"
          placeholder="Your name, please"
        />

        {
          err.name
            ? <p className={styles.formError}>{err.name}</p>
            : null
        }
      </div>

      <input
        type="submit"
        className="btn btn-success"
        value="Create room"
      />
    </form>
  );
};

export default RoomForm;