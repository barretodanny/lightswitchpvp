const {
  connectNewUser,
  disconnectUser,
  getConnectedUsers,
  updateUsername,
  getSelf,
  updateUserLobby,
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
const {
  GET_SELF,
  GET_CONNECTED_USERS,
  UPDATE_USERNAME,
  GET_LOBBIES,
  CREATE_LOBBY,
  GET_LOBBY,
} = require("./messageTypes");

let clients = [];

function handleWebSocketConnection(socket) {
  // store socket in list of clients
  clients.push(socket);

  // send client JSON of their user obj
  const self = connectNewUser(socket);
  sendDataToClient(socket, GET_SELF, self);

  // send all clients updated list of connected users
  const connectedUsers = getConnectedUsers();
  sendDataToClients(clients, GET_CONNECTED_USERS, connectedUsers);

  // get list of lobbies
  const lobbies = getLobbies();
  sendDataToClient(socket, GET_LOBBIES, lobbies);

  // setup on message and on close socket handlers
  socket.on("message", (message) => handleWebSocketMessage(socket, message));
  socket.on("close", () => handleWebSocketDisconnection(socket));
}

function handleWebSocketMessage(socket, message) {
  const req = JSON.parse(message);

  switch (req.type) {
    case UPDATE_USERNAME:
      // send client JSON of their updated user obj
      const updatedUser = updateUsername(socket, req.payload);
      sendDataToClient(socket, GET_SELF, updatedUser);

      // send all clients updated list of connected users
      const connectedUsers = getConnectedUsers();
      sendDataToClients(clients, GET_CONNECTED_USERS, connectedUsers);
      break;
    case CREATE_LOBBY:
      // create new lobby and return updated self to client
      let self = getSelf(socket);
      let newLobby = createLobby(self, req.payload);
      self = updateUserLobby(socket, newLobby.lobbyId);

      sendDataToClient(socket, GET_SELF, self);

      // send lobby details to client
      sendDataToClient(socket, GET_LOBBY, newLobby);

      // send updated list of lobbies and connected users to all clients
      const newLobbiesList = getLobbies();
      sendDataToClients(clients, GET_LOBBIES, newLobbiesList);
      const newConnectedUsersList = getConnectedUsers();
      sendDataToClients(clients, GET_CONNECTED_USERS, newConnectedUsersList);

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
  sendDataToClients(clients, GET_CONNECTED_USERS, connectedUsers);
}

function sendDataToClient(client, messageType, data) {
  const res = {
    messageType,
    data,
  };
  client.send(JSON.stringify(res));
}

function sendDataToClients(clients, messageType, data) {
  clients.forEach((client) => {
    sendDataToClient(client, messageType, data);
  });
}

module.exports = {
  handleWebSocketConnection,
};
