import { useState } from "react";
import { Lobby, User } from "../../types/types";

import styles from "./MainLobby.module.css";

interface MainLobbyProps {
  self: User | undefined;
  connectedUsers: User[];
  lobbies: Lobby[];
  handleUpdateUsername(e: React.FormEvent, newUsername: string): void;
}

function MainLobby({
  self,
  connectedUsers,
  lobbies,
  handleUpdateUsername,
}: MainLobbyProps) {
  const [usernameField, setUsernameField] = useState(self?.username || "");

  return (
    <div className={styles.container}>
      <h1>Lightswitch PVP</h1>
      <h2>Welcome {self?.username}</h2>
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
                <div>
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
                <div>
                  <span>
                    {lobby.lobbyId} - {lobby.lobbyName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainLobby;
