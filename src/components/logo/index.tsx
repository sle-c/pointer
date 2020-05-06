import React from "react";
import classNames from "classnames";

import styles from "./styles.module.scss";

interface PropTypes {
  position: "center" | "left";
  size: "sm" | "md"
}

const defaultProps = {
  position: "left",
  size: "sm",
};

const Logo = (props: PropTypes) => (
  <header
    className={
      classNames(
        {
          [styles.center]: props.position === "center" ,
        }
      )
    }
  >

    <h1 className={classNames(styles.logo, {
      [styles.md]: props.size === "md",
      [styles.sm]: props.size === "sm"
    })}>
      <a href="/">
        Pointers.
      </a>
    </h1>
  </header>
);

Logo.defaultProps = defaultProps;

export default Logo;