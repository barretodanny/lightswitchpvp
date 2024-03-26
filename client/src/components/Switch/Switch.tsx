import React from "react";

import styles from "./Switch.module.css";

interface SwitchProps {
  on: boolean;
  setOn: React.Dispatch<React.SetStateAction<boolean>>;
}

function Switch({ on, setOn }: SwitchProps) {
  return (
    <div className={styles.switchContainer}>
      <div
        className={styles.switchInner}
        onClick={() => setOn((prev) => !prev)}
      >
        <div className={` ${on ? styles.switchOn : styles.switchOff}`}></div>
      </div>
    </div>
  );
}

export default Switch;
