import { Lobby, LobbyPlayer, User } from "../../types/types";
import { getColorString } from "../../utils/utils";

import styles from "./LobbyPostGame.module.css";

interface LobbyPostGameProps {
  lobby: Lobby;
  self: User | undefined;
  handlePlayAgain(): void;
}

function LobbyPostGame({ lobby, self, handlePlayAgain }: LobbyPostGameProps) {
  if (!self) {
    return;
  }

  function sortPlayersByScore(players: LobbyPlayer[]) {
    return players.sort((p1, p2) => (p1.score >= p2.score ? -1 : 1));
  }

  // @ts-ignore
  sortPlayersByScore(lobby.connectedUsers);
  // @ts-ignore
  const winner: LobbyPlayer = lobby.connectedUsers[0];

  return (
    <div className={styles.container}>
      <div className={styles.headingWrapper}>
        <h1>Lightswitch PVP</h1>
      </div>
      <div className={styles.resultInfoWrapper}>
        {/* ts-ignore */}
        <h3>
          Winner: {winner.username} ({getColorString(winner.color)}) - Score:{" "}
          {winner.score}
        </h3>
        <div className={styles.userListWrapper}>
          {lobby.connectedUsers.map((user, index) => {
            if (index === 0) {
              return <div key={index}></div>;
            }

            return (
              // @ts-ignore
              <span key={user.userId}>
                {/* @ts-ignore */}
                {user.username} ({getColorString(user.color)}) - score:{" "}
                {/* @ts-ignore */}
                {user.score}
              </span>
            );
          })}
        </div>
      </div>

      <button
        title={self.userId === lobby.creatorId ? "" : "Waiting for host..."}
        onClick={() => handlePlayAgain()}
        className={styles.btn}
        disabled={!(self.userId === lobby.creatorId)}
      >
        Play again
      </button>
    </div>
  );
}

export default LobbyPostGame;
