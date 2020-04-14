import React from "react";
import classNames from "classnames";

import styles from "./styles.module.scss";


interface PropTypes {
  position: "center" | "left";
}

const defaultProps = {
  position: "left",
};

const Logo = (props: PropTypes) => (
  <header
    className={
      classNames(
        { [styles.center]: props.position === "center" }
      )
    }
  >
    <h1 className={styles.logo}>Pointers.</h1>
  </header>
);

Logo.defaultProps = defaultProps;

export default Logo;