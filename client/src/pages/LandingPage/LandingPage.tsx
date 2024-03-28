import { useState } from "react";
import Lightbulb from "../../components/Lightbulb/Lightbulb";
import Switch from "../../components/Switch/Switch";
import { getRandomColor } from "../../utils/utils";

import styles from "./LandingPage.module.css";

interface LandingPageProps {
  connectToServer: () => void;
}

function getColorStyleClass(color: string) {
  switch (color) {
    case "red":
      return { bg: "redbg" };
    case "yellow":
      return { bg: "yellowbg" };
    case "blue":
      return { bg: "bluebg" };
    case "green":
      return { bg: "greenbg" };
    case "orange":
      return { bg: "orangebg" };
    case "purple":
      return { bg: "purplebg" };
    case "white":
      return { bg: "whitebg" };
    case "pink":
      return { bg: "pinkbg" };
    default:
      return { bg: "nonebg" };
  }
}

function LandingPage({ connectToServer }: LandingPageProps) {
  const [on, setOn] = useState(false);

  const newColor = getRandomColor().toLowerCase();
  const colorStyle = getColorStyleClass(on ? newColor : "");

  return (
    <div className={`${styles.container} ${styles[colorStyle.bg]}`}>
      <div className={`${styles.headingWrapper} ${styles[colorStyle.bg]}`}>
        <h1>Lightswitch PVP</h1>
      </div>
      <div className={`${styles.backgroundContainer} ${styles[colorStyle.bg]}`}>
        <Switch on={on} setOn={setOn} />
        <Lightbulb color={on ? newColor : "none"} />
      </div>
      <div className={`${styles.btnWrapper} ${styles[colorStyle.bg]}`}>
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
