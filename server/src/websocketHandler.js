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
  sendDataToClient(socket, "GET_SELF", self);

  // send all clients updated list of connected users
  const connectedUsers = getConnectedUsers();
  sendDataToClients(clients, "GET_CONNECTED_USERS", connectedUsers);

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
      sendDataToClient(socket, "GET_SELF", updatedUser);

      // send all clients updated list of connected users
      const connectedUsers = getConnectedUsers();
      sendDataToClients(clients, "GET_CONNECTED_USERS", connectedUsers);
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
  sendDataToClients(clients, "GET_CONNECTED_USERS", connectedUsers);
}

function sendDataToClient(client, type, data) {
  const res = {
    type,
    data,
  };
  client.send(JSON.stringify(res));
}

function sendDataToClients(clients, type, data) {
  clients.forEach((client) => {
    sendDataToClient(client, type, data);
  });
}

module.exports = {
  handleWebSocketConnection,
};
