import { useState } from "react";
import Lightbulb from "../../components/Lightbulb/Lightbulb";

import styles from "./LandingPage.module.css";

interface LandingPageProps {
  connectToServer: () => void;
}

function LandingPage({ connectToServer }: LandingPageProps) {
  const [on, setOn] = useState(false);

  return (
    <div className={styles.container} onClick={() => setOn((prev) => !prev)}>
      <h1>Lightswitch PVP</h1>
      <Lightbulb on={on} />
      <button
        className={styles.btn}
        onClick={() => {
          connectToServer();
        }}
      >
        Play
      </button>
    </div>
  );
}

export default LandingPage;
