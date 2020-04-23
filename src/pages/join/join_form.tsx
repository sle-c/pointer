import React, { useState }  from "react";
import classNames from "classnames";
import { useHistory } from "react-router-dom";

import Interactor from "./interactor";

import styles from "./join_form.module.scss";

interface ErrorState {
  name?: string,
};

interface Props {
  sessionID: string,
};

const JoinForm = (props: Props) => {

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

    Interactor.joinSession(nameInput, props.sessionID).then(() => {
      history.push(`/r/${ props.sessionID }`);
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
        value="Join room"
      />
    </form>
  );
};

export default JoinForm;