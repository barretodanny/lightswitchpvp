import { useState } from "react";

interface User {
  userId: string;
  username: string;
  lobby: string;
}

function App() {
  const [socket, setSocket] = useState<WebSocket>();
  const [self, setSelf] = useState<User | undefined>();
  const [usernameField, setUsernameField] = useState("");
  const [connectedUsers, setConnectedUsers] = useState<User[]>([]);

  function handleUpdateUsername(e: React.FormEvent) {
    e.preventDefault();

    const req = {
      type: "UPDATE_USERNAME",
      payload: usernameField,
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

              if (data.type === "GET_SELF") {
                const self = data.data;
                setSelf(self);
              }

              if (data.type === "GET_CONNECTED_USERS") {
                const connectedUsers = data.data;
                setConnectedUsers(connectedUsers);
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

      <h3>Connected users:</h3>
      {connectedUsers.map((user) => {
        return (
          <p key={user.userId}>
            userId: {user.userId}, username: {user.username}, lobby:{" "}
            {user.lobby}
          </p>
        );
      })}
    </div>
  );
}

export default App;
