import React from "react";
import classNames from "classnames";

import styles from "./styles.module.scss";

interface Props {
  name?: string,
  label?: any,
  value?: any,
  onClick?: (value: any) => void,
  disabled?: boolean,
  readonly?: boolean,
  selectedValue?: any,
}

const PointRadio = (props: Props) => {

  const handleClick = () => {
    if (props.disabled || props.readonly) {
      return;
    }

    if (props.onClick) {
      props.onClick(props.value);
    }
  };

  const selected = props.selectedValue === props.value;
  const containerStyles = classNames(
    styles.radioButtonContainer,
    {
      [styles.selected]: selected && !props.disabled,
      [styles.disabled]: props.disabled,
      [styles.readonly]: props.readonly,
    },
  );

  return (
    <div className={containerStyles} onClick={handleClick}>
      <div className={styles.radioButton}>
        <div className={styles.innerCircle}>
        </div>
        <div className={styles.outerCircle}>
        </div>
      </div>
      <label htmlFor={props.name}>{props.label}</label>
    </div>
  )
};

export default PointRadio;