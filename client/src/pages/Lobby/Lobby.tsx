import { useState } from "react";
import { LobbyPlayer, Lobby as LobbyType, User } from "../../types/types";

interface LobbyProps {
  self: User | undefined;
  lobby: LobbyType | undefined;
  handleLeaveLobby(lobbyId: string): void;
  handleUpdateLobbyName(e: React.FormEvent, newLobbyname: string): void;
  handleUpdateLobbyGameTimer(e: React.FormEvent, newGameTimer: string): void;
  handleLobbyRandomizeSwitchToggle(e: React.FormEvent): void;
  handleToggleLobbyUserReadyStatus(e: React.FormEvent, index: string): void;
}

function Lobby({
  self,
  lobby,
  handleLeaveLobby,
  handleUpdateLobbyName,
  handleUpdateLobbyGameTimer,
  handleLobbyRandomizeSwitchToggle,
  handleToggleLobbyUserReadyStatus,
}: LobbyProps) {
  const [lobbynameField, setLobbynameField] = useState(lobby?.lobbyName || "");

  if (!lobby || !self) {
    return;
  }

  console.log(lobby);

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
        </div>
      )}
      <div>
        <p>settings</p>
        <p>game timer:{lobby.settings.gameTimer}</p>
        {self.userId === lobby.creatorId && (
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
        )}
        <p>
          randomize switch: {lobby.settings.randomizeSwitch ? "on" : "off"}
          {self.userId === lobby.creatorId && (
            <button onClick={(e) => handleLobbyRandomizeSwitchToggle(e)}>
              Turn {!lobby.settings.randomizeSwitch ? "on" : "off"}
            </button>
          )}
        </p>
      </div>
      <p>Connected users:</p>
      <div>
        {/* @ts-ignore */}
        {lobby.connectedUsers.map((user: LobbyPlayer, index) => {
          return (
            <div key={user.userId}>
              <span>
                {user.userId} - {user.username} ---{" "}
                {lobby.creatorId === user.userId ? (
                  "(HOST)"
                ) : (
                  <>
                    <span>{user.readyStatus ? "READY" : "NOT READY"}</span>
                    {self.userId === user.userId && (
                      <button
                        onClick={(e) =>
                          handleToggleLobbyUserReadyStatus(e, index.toString())
                        }
                      >
                        {!user.readyStatus ? "READY" : "UNREADY"}
                      </button>
                    )}
                  </>
                )}
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
