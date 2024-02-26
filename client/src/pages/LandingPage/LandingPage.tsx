import { useState } from "react";
import Lightbulb from "../../components/Lightbulb/Lightbulb";

import styles from "./LandingPage.module.css";

interface LandingPageProps {
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}

function LandingPage({ setCurrentPage }: LandingPageProps) {
  const [on, setOn] = useState(false);

  return (
    <div className={styles.container} onClick={() => setOn((prev) => !prev)}>
      <h1>Lightswitch PVP</h1>
      <Lightbulb on={on} />
      <button
        className={styles.btn}
        onClick={() => setCurrentPage("MAIN_LOBBY")}
      >
        Play
      </button>
    </div>
  );
}

export default LandingPage;
