import { useState } from "react";

interface User {
  userId: string;
  username: string;
  lobby: string;
}

interface Lobby {
  lobbyId: string;
  creatorId: string;
  lobbyName: string;
  connectedUsers: string[];
  lobbyState: string;
  user1Score: string;
  user2Score: string;
  lightState: string;
  gameTimer: string;
}

function App() {
  const [socket, setSocket] = useState<WebSocket>();
  const [self, setSelf] = useState<User | undefined>();
  const [usernameField, setUsernameField] = useState("");
  const [lobbyNameField, setLobbyNameField] = useState("");
  const [connectedUsers, setConnectedUsers] = useState<User[]>([]);
  const [lobbies, setLobbies] = useState<Lobby[]>([]);

  function handleUpdateUsername(e: React.FormEvent) {
    e.preventDefault();

    const req = {
      type: "UPDATE_USERNAME",
      payload: usernameField,
    };
    socket?.send(JSON.stringify(req));
  }

  function handleCreateLobby(e: React.FormEvent) {
    e.preventDefault();

    const req = {
      type: "CREATE_LOBBY",
      payload: lobbyNameField,
    };
    socket?.send(JSON.stringify(req));
  }

  function handleJoinLobby(lobbyId: string) {
    const req = {
      type: "JOIN_LOBBY",
      payload: lobbyId,
    };
    socket?.send(JSON.stringify(req));
  }

  function handleLeaveLobby(lobbyId: string) {
    const req = {
      type: "LEAVE_LOBBY",
      payload: lobbyId,
    };
    socket?.send(JSON.stringify(req));
  }

  function handleUpdateLobbyName(e: React.FormEvent) {
    e.preventDefault();

    const req = {
      type: "UPDATE_LOBBY_NAME",
      payload: lobbyNameField,
    };
    socket?.send(JSON.stringify(req));
  }

  if (!socket) {
    return (
      <div>
        <button
          onClick={() => {
            const socket = new WebSocket("ws://localhost:3000");
            socket.onmessage = async (event) => {
              const data = JSON.parse(event.data);
              console.log(data);

              if (data.messageType === "GET_SELF") {
                const self = data.data;
                setSelf(self);
              } else if (data.messageType === "GET_CONNECTED_USERS") {
                const connectedUsers = data.data;
                setConnectedUsers(connectedUsers);
              } else if (data.messageType === "GET_LOBBIES") {
                const lobbies = data.data;
                setLobbies(lobbies);
              }
            };
            setSocket(socket);
          }}
        >
          Connect
        </button>
      </div>
    );
  }

  if (!self) {
    return;
  }

  return (
    <div>
      <p>
        Connected as: userId: {self.userId}, username: {self.username}, lobby:{" "}
        {self.lobby}
      </p>

      <div>
        <form onSubmit={handleUpdateUsername}>
          <input
            type="text"
            value={usernameField}
            onChange={(e) => setUsernameField(e.target.value)}
          />
          <button type="submit">Update Username</button>
        </form>
      </div>

      {parseInt(self.lobby) === 0 && (
        <div>
          <form onSubmit={handleCreateLobby}>
            <input
              type="text"
              value={lobbyNameField}
              onChange={(e) => setLobbyNameField(e.target.value)}
            />
            <button type="submit">Create Lobby</button>
          </form>
        </div>
      )}

      <h3>Connected users:</h3>
      {connectedUsers.map((user) => {
        return (
          <p key={user.userId}>
            userId: {user.userId}, username: {user.username}, lobby:{" "}
            {user.lobby}
          </p>
        );
      })}

      <h3>Lobbies:</h3>
      {lobbies.length === 0 ? (
        <p>No Lobbies Found</p>
      ) : (
        <div>
          {lobbies.map((lobby) => {
            return (
              <div key={lobby.lobbyId}>
                <p>
                  lobbyId: {lobby.lobbyId}, lobbyName: {lobby.lobbyName}, #
                  users: {lobby.connectedUsers.length}
                  {parseInt(self.lobby) === 0 && (
                    <button onClick={() => handleJoinLobby(lobby.lobbyId)}>
                      Join
                    </button>
                  )}
                  {parseInt(self.lobby) === parseInt(lobby.lobbyId) && (
                    <button onClick={() => handleLeaveLobby(lobby.lobbyId)}>
                      Leave
                    </button>
                  )}
                </p>
                {parseInt(lobby.creatorId) === parseInt(self?.userId) && (
                  <form onSubmit={handleUpdateLobbyName}>
                    <input
                      type="text"
                      value={lobbyNameField}
                      onChange={(e) => setLobbyNameField(e.target.value)}
                    />
                    <button type="submit">Update Lobby Name</button>
                  </form>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default App;
