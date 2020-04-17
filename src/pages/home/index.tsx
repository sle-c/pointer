import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import Session from "../../services/session";
import SessionDomain, { SessionStatus } from "../../domains/session";
import styles from "./styles.module.scss";
import Auth from "../../services/auth";
import Logo from "../../components/logo";

const session = new Session();
const auth = new Auth();

const createSession = (name: string, history: any) => {
  auth.signUpAnonymously(name).then((user) => {
    session.create({
      status: SessionStatus.Active,
      hostID: user.UID,
    }).then((session: SessionDomain) => {
      const location = {
        pathname: '/invite',
        state: {
          session: session,
          user: user,
        },
      };
      history.push(location);
    });
  });
};

const Home = () => {
  const [nameInput, setNameInput] = useState("");
  const history = useHistory();

  const onNameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameInput(e.target.value);
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createSession(nameInput, history);
  };

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
            <form id={styles.roomForm} onSubmit={onSubmit}>
              <input
                name="name"
                value={nameInput}
                onChange={onNameChanged}
                type="text"
                placeholder="Your name, please"
              />

              <input
                type="submit"
                className="btn btn-success"
                value="Create room"
              />
            </form>
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

export default Home;