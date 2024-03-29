import { Lobby, User } from "../../types/types";
import Switch from "../../components/Switch/Switch";
import Lightbulb from "../../components/Lightbulb/Lightbulb";
import { getColorString } from "../../utils/utils";

import styles from "./Game.module.css";

interface GameProps {
  lobby: Lobby;
  self: User | undefined;
  toggleLightColor(index: string): void;
}

function getColorStyleClass(color: number) {
  switch (color) {
    case 0:
      return { color: "red", bg: "redbg" };
    case 1:
      return { color: "yellow", bg: "yellowbg" };
    case 2:
      return { color: "blue", bg: "bluebg" };
    case 3:
      return { color: "green", bg: "greenbg" };
    case 4:
      return { color: "orange", bg: "orangebg" };
    case 5:
      return { color: "purple", bg: "purplebg" };
    case 6:
      return { color: "white", bg: "whitebg" };
    case 7:
      return { color: "pink", bg: "pinkbg" };
    default:
      return { color: "none", bg: "nonebg" };
  }
}

function Game({ lobby, self, toggleLightColor }: GameProps) {
  const colorStyle = getColorStyleClass(lobby.currentColor);

  let selfIndex: number;
  for (let i = 0; i < lobby.connectedUsers.length; i++) {
    const user = lobby.connectedUsers[i];
    //@ts-ignore
    if (user.userId === self.userId) {
      selfIndex = i;
      break;
    }
  }

  return (
    <div className={`${styles.container} ${styles[colorStyle.bg]}`}>
      <div className={`${styles.headingWrapper}`}>
        <h1>Lightswitch PVP</h1>
      </div>
      <div className={styles.gameInfoWrapper}>
        <p>{lobby.gameTimer} seconds remaining</p>
        <span className={styles.gameInfo}>
          {lobby.connectedUsers.map((user) => (
            <span
              //@ts-ignore
              key={user.userId}
              className={
                //@ts-ignore
                lobby.currentColor === user.color
                  ? styles[colorStyle.color]
                  : ""
              }
            >
              {/* @ts-ignore */}
              Username: {user.username} ({getColorString(user.color)}) - Score:{" "}
              {/* @ts-ignore */}
              {user.score}
            </span>
          ))}
        </span>
      </div>
      <div className={`${styles.backgroundContainer}`}>
        <div onClick={() => toggleLightColor(selfIndex.toString())}>
          <Switch on={lobby.currentColor !== -1} setOn={() => {}} />
        </div>
        <Lightbulb color={colorStyle.color} />
      </div>
    </div>
  );
}

export default Game;
