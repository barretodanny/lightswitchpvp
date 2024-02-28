import { useState } from "react";
import { Lobby as LobbyType, User } from "../../types/types";

interface LobbyProps {
  self: User | undefined;
  lobby: LobbyType | undefined;
  handleLeaveLobby(lobbyId: string): void;
  handleUpdateLobbyName(e: React.FormEvent, newLobbyname: string): void;
}

function Lobby({
  self,
  lobby,
  handleLeaveLobby,
  handleUpdateLobbyName,
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
          <form onSubmit={(e) => handleUpdateLobbyName(e, lobbynameField)}>
            <input
              type="text"
              value={lobbynameField}
              onChange={(e) => setLobbynameField(e.target.value)}
            />
            <button>Update lobby name</button>
          </form>
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
