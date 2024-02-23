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
  // store socket in list of clients
  clients.push(socket);

  // send client JSON of their user obj
  const self = connectNewUser(socket);
  const res = {
    type: "GET_SELF",
    data: self,
  };
  socket.send(JSON.stringify(res));

  // send all clients updated list of connected users
  const connectedUsers = getConnectedUsers();
  sendDataToAllClients(clients, "GET_CONNECTED_USERS", connectedUsers);

  // setup on message and on close socket handlers
  socket.on("message", (message) => handleWebSocketMessage(socket, message));
  socket.on("close", () => handleWebSocketDisconnection(socket));
}

function handleWebSocketMessage(socket, message) {
  const req = JSON.parse(message);

  switch (req.type) {
    case "UPDATE_USERNAME":
      // send client JSON of their updated user obj
      const updatedUser = updateUsername(socket, req.payload);
      const res = {
        type: "GET_SELF",
        data: updatedUser,
      };
      socket.send(JSON.stringify(res));

      // send all clients updated list of connected users
      const connectedUsers = getConnectedUsers();
      sendDataToAllClients(clients, "GET_CONNECTED_USERS", connectedUsers);
      break;

    default:
      break;
  }
}

function handleWebSocketDisconnection(socket) {
  // disconnected user and remove socket from list of clients
  disconnectUser(socket);
  clients = clients.filter((client) => client !== socket);

  // send all clients updated list of connected users
  const connectedUsers = getConnectedUsers();
  sendDataToAllClients(clients, "GET_CONNECTED_USERS", connectedUsers);
}

function sendDataToAllClients(clients, type, data) {
  clients.forEach((client) => {
    const res = {
      type,
      data,
    };
    client.send(JSON.stringify(res));
  });
}

module.exports = {
  handleWebSocketConnection,
};
