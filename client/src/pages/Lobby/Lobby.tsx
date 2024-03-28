import { useState } from "react";
import {
  LobbyPlayer,
  LobbyStates,
  Lobby as LobbyType,
  User,
} from "../../types/types";
import LobbyCountdown from "../LobbyCountdown/LobbyCountdown";
import Game from "../Game/Game";
import LobbyPostGame from "../LobbyPostGame/LobbyPostGame";

import styles from "./Lobby.module.css";

function getColorStyleClass(color: string) {
  switch (color) {
    case "0":
      return { color: "white", bg: "redbg" };
    case "1":
      return { color: "black", bg: "yellowbg" };
    case "2":
      return { color: "white", bg: "bluebg" };
    case "3":
      return { color: "white", bg: "greenbg" };
    case "4":
      return { color: "black", bg: "orangebg" };
    case "5":
      return { color: "white", bg: "purplebg" };
    case "6":
      return { color: "black", bg: "whitebg" };
    case "7":
      return { color: "pink", bg: "pinkbg" };
    default:
      return { color: "none", bg: "nonebg" };
  }
}

interface LobbyProps {
  self: User | undefined;
  lobby: LobbyType | undefined;
  handleLeaveLobby(lobbyId: string): void;
  handleUpdateLobbyName(newLobbyname: string): void;
  handleUpdateLobbyGameTimer(e: React.FormEvent, newGameTimer: string): void;
  handleLobbyRandomizeSwitchToggle(e: React.FormEvent): void;
  handleToggleLobbyUserReadyStatus(index: string): void;
  handleUpdateLobbyUserColorChoice(
    e: React.FormEvent,
    index: string,
    color: string
  ): void;
  handleStartMatch(): void;
  toggleLightColor(index: string): void;
  handlePlayAgain(): void;
}

function Lobby({
  self,
  lobby,
  handleLeaveLobby,
  handleUpdateLobbyName,
  handleUpdateLobbyGameTimer,
  handleToggleLobbyUserReadyStatus,
  handleUpdateLobbyUserColorChoice,
  handleStartMatch,
  toggleLightColor,
  handlePlayAgain,
}: LobbyProps) {
  const [lobbynameField, setLobbynameField] = useState(lobby?.lobbyName || "");
  const [ready, setReady] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  if (!lobby || !self) {
    return;
  }

  if (lobby.lobbyState === LobbyStates.COUNTDOWN) {
    return <LobbyCountdown />;
  }

  if (lobby.lobbyState === LobbyStates.GAME) {
    return (
      <Game lobby={lobby} self={self} toggleLightColor={toggleLightColor} />
    );
  }

  if (lobby.lobbyState === LobbyStates.POST_GAME) {
    return (
      <LobbyPostGame
        lobby={lobby}
        self={self}
        handlePlayAgain={handlePlayAgain}
      />
    );
  }

  // check if all players in lobby are ready to determine if the host can start the match
  const readyUsers = lobby.connectedUsers.filter(
    (user: any) => user.readyStatus === true
  );
  const canStart =
    lobby.connectedUsers.length > 1 &&
    lobby.connectedUsers.length === readyUsers.length;

  const takenColors: number[] = [];
  for (let i = 0; i < lobby.connectedUsers.length; i++) {
    // @ts-ignore
    const player: LobbyPlayer = lobby.connectedUsers[i];
    // @ts-ignore
    takenColors.push(player.color);
  }

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
    <div className={styles.container}>
      <div className={styles.headingWrapper}>
        <h1>Lightswitch PVP</h1>
      </div>
      <div className={styles.lobbyWrapper}>
        <div className={styles.infoWrapper}>
          <h2>{lobby.lobbyName}</h2>
          <h3>Game Timer: {lobby.settings.gameTimer}</h3>
        </div>

        <>
          {!showSettings && (
            <>
              <div className={styles.userListWrapper}>
                {lobby.connectedUsers.map((user) => {
                  // @ts-ignore
                  const colorStyle = getColorStyleClass(user.color.toString());
                  return (
                    <div
                      // @ts-ignore
                      key={user.userId}
                      className={`${styles.userItem} ${styles[colorStyle.bg]} ${
                        styles[colorStyle.color]
                      }`}
                    >
                      {/* @ts-ignore */}
                      {user.username} ({/* @ts-ignore */}
                      {user.readyStatus ? "Ready" : "Not Ready"})
                    </div>
                  );
                })}
              </div>
            </>
          )}
          {showSettings && (
            <>
              <div className={styles.settingsWrapper}>
                <h3>Update Lobby Name</h3>
                <div className={styles.lobbynameInputWrapper}>
                  <input
                    type="text"
                    value={lobbynameField}
                    onChange={(e) => setLobbynameField(e.target.value)}
                  />
                  <button onClick={() => handleUpdateLobbyName(lobbynameField)}>
                    Update lobby name
                  </button>
                </div>

                <h3>Choose Game Length (seconds)</h3>
                <div className={styles.gameTimerBtns}>
                  <button onClick={(e) => handleUpdateLobbyGameTimer(e, "30")}>
                    30
                  </button>
                  <button onClick={(e) => handleUpdateLobbyGameTimer(e, "60")}>
                    60
                  </button>
                  <button onClick={(e) => handleUpdateLobbyGameTimer(e, "120")}>
                    120
                  </button>
                  <button onClick={(e) => handleUpdateLobbyGameTimer(e, "300")}>
                    300
                  </button>
                </div>
              </div>
            </>
          )}
          <div className={styles.btnWrapper}>
            <div className={styles.colorsWrapper}>
              <h3>Choose color</h3>
              <div className={styles.colorBtnsWrapper}>
                <button
                  disabled={takenColors.includes(0)}
                  onClick={(e) =>
                    handleUpdateLobbyUserColorChoice(
                      e,
                      selfIndex.toString(),
                      "0"
                    )
                  }
                  className={`${styles.redbg} ${styles.white}`}
                ></button>
                <button
                  disabled={takenColors.includes(1)}
                  onClick={(e) =>
                    handleUpdateLobbyUserColorChoice(
                      e,
                      selfIndex.toString(),
                      "1"
                    )
                  }
                  className={`${styles.yellowbg} ${styles.white}`}
                ></button>
                <button
                  disabled={takenColors.includes(2)}
                  onClick={(e) =>
                    handleUpdateLobbyUserColorChoice(
                      e,
                      selfIndex.toString(),
                      "2"
                    )
                  }
                  className={`${styles.bluebg} ${styles.white}`}
                ></button>
                <button
                  disabled={takenColors.includes(3)}
                  onClick={(e) =>
                    handleUpdateLobbyUserColorChoice(
                      e,
                      selfIndex.toString(),
                      "3"
                    )
                  }
                  className={`${styles.greenbg} ${styles.white}`}
                ></button>
                <button
                  disabled={takenColors.includes(4)}
                  onClick={(e) =>
                    handleUpdateLobbyUserColorChoice(
                      e,
                      selfIndex.toString(),
                      "4"
                    )
                  }
                  className={`${styles.orangebg} ${styles.white}`}
                ></button>
                <button
                  disabled={takenColors.includes(5)}
                  onClick={(e) =>
                    handleUpdateLobbyUserColorChoice(
                      e,
                      selfIndex.toString(),
                      "5"
                    )
                  }
                  className={`${styles.purplebg} ${styles.white}`}
                ></button>
                <button
                  disabled={takenColors.includes(6)}
                  onClick={(e) =>
                    handleUpdateLobbyUserColorChoice(
                      e,
                      selfIndex.toString(),
                      "6"
                    )
                  }
                  className={`${styles.whitebg} ${styles.white}`}
                ></button>
              </div>
            </div>
            <div className={styles.bottomWrapper}>
              {lobby.creatorId === self.userId ? (
                <>
                  <button disabled={!canStart} onClick={handleStartMatch}>
                    Start
                  </button>
                  <button onClick={() => setShowSettings((prev) => !prev)}>
                    {showSettings ? "Back" : "Settings"}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setReady((prev) => !prev);
                      handleToggleLobbyUserReadyStatus(selfIndex.toString());
                    }}
                  >
                    {ready ? "Unready" : "Ready"}
                  </button>
                </>
              )}
              <button onClick={() => handleLeaveLobby(lobby.lobbyId)}>
                Leave
              </button>
            </div>
          </div>
        </>
      </div>
    </div>
  );
}

export default Lobby;
