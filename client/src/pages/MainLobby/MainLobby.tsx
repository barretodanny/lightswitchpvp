import { useState } from "react";
import { Lobby, LobbyStates, User } from "../../types/types";

import styles from "./MainLobby.module.css";

interface MainLobbyProps {
  self: User | undefined;
  connectedUsers: User[];
  lobbies: Lobby[];
  handleUpdateUsername(newUsername: string): void;
  handleCreateLobby(lobbyName: string): void;
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
  const [shownContent, setShownContent] = useState("LOBBY_LIST");

  return (
    <div className={styles.container}>
      <div className={styles.headingWrapper}>
        <h1>Lightswitch PVP</h1>
      </div>
      <div className={styles.subheadingWrapper}>
        <h2>Welcome {self?.username}</h2>
      </div>
      <div className={styles.usernameInputWrapper}>
        <h3>Update Your Username</h3>
        <div className={styles.usernameInput}>
          <input
            type="text"
            value={usernameField}
            onChange={(e) => setUsernameField(e.target.value)}
          />
          <button onClick={() => handleUpdateUsername(usernameField)}>
            Update
          </button>
        </div>
      </div>
      <div className={styles.bottom}>
        <div className={styles.contentWrapper}>
          {shownContent === "LOBBY_LIST" && (
            <>
              <div className={styles.lobbyListWrapper}>
                <h3>Lobbies</h3>
                <div className={styles.lobbyList}>
                  {lobbies.map((lobby) => {
                    return (
                      <div key={lobby.lobbyId} className={styles.lobbyListItem}>
                        <span>Lobby Name: {lobby.lobbyName}</span>
                        <button
                          disabled={
                            lobby.connectedUsers.length >= 4 ||
                            lobby.lobbyState !== LobbyStates.SETUP
                          }
                          onClick={() => handleJoinLobby(lobby.lobbyId)}
                        >
                          Join ({lobby.connectedUsers.length}/4)
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
          {shownContent === "CREATE_LOBBY" && (
            <>
              <div className={styles.lobbyInputWrapper}>
                <h3>Create Lobby</h3>
                <div className={styles.lobbyInput}>
                  <input
                    type="text"
                    value={lobbynameField}
                    onChange={(e) => setLobbynameField(e.target.value)}
                  />
                  <button
                    onClick={() => handleCreateLobby(lobbynameField)}
                    disabled={lobbynameField.length === 0}
                  >
                    Create
                  </button>
                </div>
              </div>
            </>
          )}
          {shownContent === "USER_LIST" && (
            <>
              <div className={styles.userListWrapper}>
                <h3>Online Users</h3>
                <div className={styles.userList}>
                  {connectedUsers.map((user) => {
                    return (
                      <div key={user.userId} className={styles.userListItem}>
                        <span>Username: {user.username}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
          <div className={styles.btnsWrapper}>
            <button
              onClick={() => {
                setShownContent("LOBBY_LIST");
                setLobbynameField("");
              }}
            >
              Show Lobbies
            </button>
            <button
              onClick={() => {
                setShownContent("USER_LIST");
                setLobbynameField("");
              }}
            >
              Show Users
            </button>
            <button onClick={() => setShownContent("CREATE_LOBBY")}>
              Create Lobby
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainLobby;
