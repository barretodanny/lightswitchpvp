import { useState } from "react";
import { Lobby, User } from "../../types/types";

import styles from "./MainLobby.module.css";

interface MainLobbyProps {
  self: User | undefined;
  connectedUsers: User[];
  lobbies: Lobby[];
  handleUpdateUsername(e: React.FormEvent, newUsername: string): void;
  handleCreateLobby(e: React.FormEvent, lobbyName: string): void;
  handleJoinLobby(lobbyId: string): void;
}

function MainLobby({
  self,
  connectedUsers,
  lobbies,
  handleUpdateUsername,
  handleCreateLobby,
  handleJoinLobby,
}: MainLobbyProps) {
  const [usernameField, setUsernameField] = useState(self?.username || "");
  const [lobbynameField, setLobbynameField] = useState("");

  return (
    <div className={styles.container}>
      <h1>Lightswitch PVP</h1>
      <h2>
        Welcome {self?.username} - {self?.lobby}
      </h2>
      <div className={styles.formWrapper}>
        <p>Choose your username</p>
        <form
          onSubmit={(e: React.FormEvent) =>
            handleUpdateUsername(e, usernameField)
          }
        >
          <input
            type="text"
            value={usernameField}
            onChange={(e) => setUsernameField(e.target.value)}
          />
          <button>Update</button>
        </form>
      </div>
      <div style={{ display: "flex", gap: 15 }}>
        <div>
          <p>Online Users</p>
          <div>
            {connectedUsers.map((user) => {
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
        <div>
          <p>Open Lobbies</p>
          <div>
            {lobbies.map((lobby) => {
              return (
                <div key={lobby.lobbyId}>
                  <span>
                    {lobby.lobbyId} - {lobby.lobbyName} -{" "}
                    {lobby.connectedUsers.length}/4 user(s)
                  </span>
                  <button
                    disabled={lobby.connectedUsers.length >= 4}
                    onClick={() => handleJoinLobby(lobby.lobbyId)}
                  >
                    Join
                  </button>
                </div>
              );
            })}
          </div>
          <div>
            <form
              onSubmit={(e: React.FormEvent) =>
                handleCreateLobby(e, lobbynameField)
              }
            >
              <input
                type="text"
                value={lobbynameField}
                onChange={(e) => setLobbynameField(e.target.value)}
              />
              <button type="submit">Create Lobby</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainLobby;
