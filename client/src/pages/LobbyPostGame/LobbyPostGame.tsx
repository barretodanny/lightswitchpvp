import { Lobby, LobbyPlayer, User } from "../../types/types";

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

  return (
    <div>
      <div>
        <p>Users</p>
        <div>
          {lobby.connectedUsers.map((user) => {
            return (
              // @ts-ignore
              <div key={user.userId}>
                {/* @ts-ignore */}
                userId: {user.userId} username: {user.username} score:{" "}
                {/* @ts-ignore */}
                {user.score}
              </div>
            );
          })}
        </div>
      </div>
      {self.userId === lobby.creatorId && (
        <button onClick={() => handlePlayAgain()}>Play again</button>
      )}
    </div>
  );
}

export default LobbyPostGame;
