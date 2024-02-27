import { Lobby as LobbyType, User } from "../../types/types";

interface LobbyProps {
  lobby: LobbyType | undefined;
  handleLeaveLobby(lobbyId: string): void;
}

function Lobby({ lobby, handleLeaveLobby }: LobbyProps) {
  if (!lobby) {
    return;
  }

  return (
    <div>
      <p>ID: {lobby.lobbyId}</p>
      <p>Name: {lobby.lobbyName}</p>
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
