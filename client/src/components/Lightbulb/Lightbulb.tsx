import styles from "./Lightbulb.module.css";

interface LightbulbProps {
  color: string;
}

function getColorStyleClass(color: string) {
  switch (color) {
    case "red":
      return { color: "red", lightEffect: "redLightEffect" };
    case "yellow":
      return { color: "yellow", lightEffect: "yellowLightEffect" };
    case "blue":
      return { color: "blue", lightEffect: "blueLightEffect" };
    case "green":
      return { color: "green", lightEffect: "greenLightEffect" };
    case "orange":
      return { color: "orange", lightEffect: "orangeLightEffect" };
    case "purple":
      return { color: "purple", lightEffect: "purpleLightEffect" };
    case "white":
      return { color: "white", lightEffect: "whiteLightEffect" };
    case "pink":
      return { color: "pink", lightEffect: "pinkLightEffect" };
    default:
      return { color: "yellow", lightEffect: "yellowLightEffect" };
  }
}

function Lightbulb({ color }: LightbulbProps) {
  const colorStyle = getColorStyleClass(color);

  return (
    <div className={styles.lightbulb}>
      <div
        className={`${styles.bulb} ${styles[colorStyle.color]} ${
          styles[colorStyle.lightEffect]
        }`}
      >
        <div
          className={`${styles.bulbBottom} ${styles[colorStyle.color]}`}
        ></div>
      </div>
      <div className={styles.base}></div>
    </div>
  );
}

export default Lightbulb;
