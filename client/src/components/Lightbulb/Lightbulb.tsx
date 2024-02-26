import styles from "./Lightbulb.module.css";

interface LightbulbProps {
  on: boolean;
}

function Lightbulb({ on }: LightbulbProps) {
  return (
    <div className={styles.lightbulb}>
      <div
        className={`${styles.bulb} ${on && `${styles.on}`} ${
          on && `${styles.lightEffect}`
        }`}
      >
        <div className={`${styles.bulbBottom} ${on && `${styles.on}`}`}></div>
      </div>
      <div className={styles.base}></div>
    </div>
  );
}

export default Lightbulb;
