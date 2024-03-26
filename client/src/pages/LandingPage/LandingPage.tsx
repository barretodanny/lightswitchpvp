import { useState } from "react";
import Lightbulb from "../../components/Lightbulb/Lightbulb";
import Switch from "../../components/Switch/Switch";
import { getRandomColor } from "../../utils/utils";

import styles from "./LandingPage.module.css";

interface LandingPageProps {
  connectToServer: () => void;
}

function LandingPage({ connectToServer }: LandingPageProps) {
  const [on, setOn] = useState(false);

  const newColor = getRandomColor().toLowerCase();

  return (
    <div className={styles.container}>
      <div
        className={`${styles.headingWrapper} ${
          on ? styles.bgOn : styles.bgOff
        }`}
      >
        <h1>Lightswitch PVP</h1>
      </div>
      <div
        className={`${styles.backgroundContainer} ${
          on ? styles.bgOn : styles.bgOff
        }`}
      >
        <Switch on={on} setOn={setOn} />
        <Lightbulb color={on ? newColor : "none"} />
      </div>
      <div
        className={`${styles.btnWrapper} ${on ? styles.bgOn : styles.bgOff}`}
      >
        <button
          className={styles.btn}
          onClick={() => {
            connectToServer();
          }}
        >
          Play
        </button>
      </div>
    </div>
  );
}

export default LandingPage;
