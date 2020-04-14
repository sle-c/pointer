import React, { useState } from "react";

import Session from "../../services/session";
import { SessionStatus } from "../../domains/session";
import styles from "./styles.module.scss";
import Auth from "../../services/auth";

const session = new Session();
const auth = new Auth();

const createSession = (name: string) => {
  auth.signUpAnonymously(name).then((user) => {
    session.create({
      status: SessionStatus.Active,
      hostID: user.UID,
    });
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
      <div className="container">
        <header>
          <h1 className={styles.logo}>Pointers.</h1>
        </header>


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
        <img
          id={styles.carCat}
          src="https://firebasestorage.googleapis.com/v0/b/pointer-3906a.appspot.com/o/public%2Fimages%2Fcar-cat.png?alt=media"
          alt="car-cat"
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
                id={styles.createRoomBtn}
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