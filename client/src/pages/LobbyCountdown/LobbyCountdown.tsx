import { useEffect, useState } from "react";

import styles from "./LobbyCountdown.module.css";

function LobbyCountdown() {
  const [timer, setTimer] = useState(3);

  useEffect(() => {
    const itv = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => {
      clearInterval(itv);
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.headingWrapper}>
        <h1>Lightswitch PVP</h1>
      </div>
      <div className={styles.countdownWrapper}>
        <h3>{timer}</h3>
      </div>
    </div>
  );
}

export default LobbyCountdown;
