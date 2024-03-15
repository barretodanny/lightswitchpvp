import { useState } from "react";
import { Lobby, User } from "../../types/types";
import { getColorString } from "../../utils/utils";

interface GameProps {
  lobby: Lobby;
  self: User | undefined;
  toggleLightColor(index: string): void;
}

function Game({ lobby, self, toggleLightColor }: GameProps) {
  const [selfIndex, setSelfIndex] = useState<string>("");
  return (
    <div>
      <div>
        <p>Users</p>
        {lobby.connectedUsers.map((user, index) => {
          // @ts-ignore
          if (!selfIndex && user.userId === self?.userId) {
            setSelfIndex(index.toString());
          }
          return (
            // @ts-ignore
            <div key={user.userId}>
              <p>
                {/* @ts-ignore */}
                userId: {user.userId} username: {user.username} color:{" "}
                {/* @ts-ignore */}
                {user.color} score: {user.score}
              </p>
            </div>
          );
        })}
      </div>
      <div>
        <p>Timer: {lobby.gameTimer}</p>
      </div>
      <div>
        <p>
          Current color:{" "}
          {lobby.currentColor === -1
            ? "None"
            : getColorString(lobby.currentColor.toString())}
        </p>
      </div>
      <div>
        <button onClick={() => toggleLightColor(selfIndex)}>
          Toggle light {selfIndex}
        </button>
      </div>
    </div>
  );
}

export default Game;
