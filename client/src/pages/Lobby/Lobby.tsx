import { useState } from "react";
import { Lobby as LobbyType, User } from "../../types/types";

interface LobbyProps {
  self: User | undefined;
  lobby: LobbyType | undefined;
  handleLeaveLobby(lobbyId: string): void;
  handleUpdateLobbyName(e: React.FormEvent, newLobbyname: string): void;
  handleUpdateLobbyGameTimer(e: React.FormEvent, newGameTimer: string): void;
  handleLobbyRandomizeSwitchToggle(e: React.FormEvent): void;
}

function Lobby({
  self,
  lobby,
  handleLeaveLobby,
  handleUpdateLobbyName,
  handleUpdateLobbyGameTimer,
  handleLobbyRandomizeSwitchToggle,
}: LobbyProps) {
  const [lobbynameField, setLobbynameField] = useState(lobby?.lobbyName || "");

  if (!lobby || !self) {
    return;
  }

  return (
    <div>
      <p>ID: {lobby.lobbyId}</p>
      <p>Name: {lobby.lobbyName}</p>
      {self.userId === lobby.creatorId && (
        <div>
          <p>CREATOR</p>
          <div>
            <form onSubmit={(e) => handleUpdateLobbyName(e, lobbynameField)}>
              <input
                type="text"
                value={lobbynameField}
                onChange={(e) => setLobbynameField(e.target.value)}
              />
              <button>Update lobby name</button>
            </form>
          </div>
          <div>
            <p>settings</p>
            <p>game timer:{lobby.settings.gameTimer}</p>
            <div>
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
            <p>
              randomize switch: {lobby.settings.randomizeSwitch ? "on" : "off"}
              <button onClick={(e) => handleLobbyRandomizeSwitchToggle(e)}>
                Turn {!lobby.settings.randomizeSwitch ? "on" : "off"}
              </button>
            </p>
          </div>
        </div>
      )}
      <p>Connected users:</p>
      <div>
        {/* @ts-ignore */}
        {lobby.connectedUsers.map((user: User) => {
          return (
            <div key={user.userId}>
              <span>
                {user.userId} - {user.username}
              </span>
            </div>
          );
        })}
      </div>
      <button onClick={() => handleLeaveLobby(lobby.lobbyId)}>Leave</button>
    </div>
  );
}

export default Lobby;
