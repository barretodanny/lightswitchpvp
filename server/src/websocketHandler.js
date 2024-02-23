const {
  connectNewUser,
  disconnectUser,
  getConnectedUsers,
  updateUsername,
} = require("./user");
const {
  getLobbies,
  getCurrentLobby,
  joinLobby,
  leaveLobby,
  createLobby,
  updateLobbyName,
  deleteLobby,
} = require("./lobby");

let clients = [];

function handleWebSocketConnection(socket) {
  clients.push(socket);

  const self = connectNewUser(socket);
  const res = {
    type: "GET_SELF",
    data: self,
  };
  socket.send(JSON.stringify(res));

  const connectedUsers = getConnectedUsers();
  clients.forEach((client) => {
    const res = {
      type: "GET_CONNECTED_USERS",
      data: connectedUsers,
    };
    client.send(JSON.stringify(res));
  });

  socket.on("message", (message) => handleWebSocketMessage(socket, message));
  socket.on("close", () => handleWebSocketDisconnection(socket));
}

function handleWebSocketMessage(socket, message) {
  const req = JSON.parse(message);

  switch (req.type) {
    case "UPDATE_USERNAME":
      const updatedUser = updateUsername(socket, req.payload);
      const res = {
        type: "GET_SELF",
        data: updatedUser,
      };
      socket.send(JSON.stringify(res));

      clients.forEach((client) => {
        const connectedUsers = getConnectedUsers();
        const res = {
          type: "GET_CONNECTED_USERS",
          data: connectedUsers,
        };
        client.send(JSON.stringify(res));
      });
      break;

    default:
      break;
  }
}

function handleWebSocketDisconnection(socket) {
  disconnectUser(socket);

  clients = clients.filter((client) => client !== socket);
  const connectedUsers = getConnectedUsers();

  clients.forEach((client) => {
    const res = {
      type: "GET_CONNECTED_USERS",
      data: connectedUsers,
    };
    client.send(JSON.stringify(res));
  });
}

module.exports = {
  handleWebSocketConnection,
};
