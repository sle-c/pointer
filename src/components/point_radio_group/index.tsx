import React, { useState } from "react";
import classNames from "classnames";

import styles from "./styles.module.scss";

import PointRadio from "../point_radio";

type Selection = {
  label: any,
  value: any,
};

interface Props {
  className?: any,
  collection: Selection[],
  disabled?: boolean,
  readonly?: boolean,
  onChange?: (value: any) => void,
}

const PointRadioGroup = (props: Props) => {
  const [selectedValue, setValue] = useState(null);

  const clicked = (val: any) => {
    if (selectedValue === val) {
      return;
    }
    setValue(val);
    if (props.onChange) {
      props.onChange(val);
    }
  }

  const selections = props.collection.map((selection, i) => {
    return (
      <PointRadio
        key={`point-radio-${i}`}
        name="point"
        value={selection.value}
        label={selection.label}
        onClick={clicked}
        disabled={props.disabled}
        selectedValue={selectedValue}
        readonly={props.readonly}
      />
    );
  });

  const klass = classNames(
    styles.radioGroup,
    props.className,
  );

  return (
    <div className={klass}>
      {selections}
    </div>
  )
};

export default PointRadioGroup;