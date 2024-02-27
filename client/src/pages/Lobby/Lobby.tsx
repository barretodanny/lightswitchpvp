import { Lobby as LobbyType, User } from "../../types/types";

interface LobbyProps {
  lobby: LobbyType | undefined;
}

function Lobby({ lobby }: LobbyProps) {
  return (
    <div>
      <p>ID: {lobby?.lobbyId}</p>
      <p>Name: {lobby?.lobbyName}</p>
      <p>Connected users:</p>
      <div>
        {/* @ts-ignore */}
        {lobby?.connectedUsers.map((user: User) => {
          return (
            <div key={user.userId}>
              <span>
                {user.userId} - {user.username}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Lobby;
