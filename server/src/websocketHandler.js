const {
  connectNewUser,
  disconnectUser,
  getConnectedUsers,
  updateUsername,
  getSelf,
  updateUserLobby,
  getSocketByUser,
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
  JOIN_LOBBY,
  LEAVE_LOBBY,
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
    case UPDATE_USERNAME: {
      // send client JSON of their updated user obj
      const updatedUser = updateUsername(socket, req.payload);
      sendDataToClient(socket, GET_SELF, updatedUser);

      // send all clients updated list of connected users
      const connectedUsers = getConnectedUsers();
      sendDataToClients(clients, GET_CONNECTED_USERS, connectedUsers);
      break;
    }
    case CREATE_LOBBY: {
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
      break;
    }
    case JOIN_LOBBY: {
      let self = getSelf(socket);
      let lobby = joinLobby(self, req.payload);
      self = updateUserLobby(socket, lobby.lobbyId);

      sendDataToClient(socket, GET_SELF, self);

      // send lobbydetails to client
      sendDataToClient(socket, GET_LOBBY, lobby);

      // send updated list of lobbies and connected users to all clients
      const newLobbiesList = getLobbies();
      sendDataToClients(clients, GET_LOBBIES, newLobbiesList);
      const newConnectedUsersList = getConnectedUsers();
      sendDataToClients(clients, GET_CONNECTED_USERS, newConnectedUsersList);
      break;
    }
    case LEAVE_LOBBY: {
      let self = getSelf(socket);
      const result = leaveLobby(self, self.lobby);

      // if creator, send the rest of the players in to lobby to main lobby
      if (result) {
        result.forEach((user) => {
          const userSocket = getSocketByUser(user);
          const updatedUser = updateUserLobby(userSocket, 0);
          sendDataToClient(userSocket, GET_SELF, updatedUser);
        });
      }

      // send client updated self
      self = updateUserLobby(socket, 0);
      sendDataToClient(socket, GET_SELF, self);

      // send updated list of lobbies and connected users to all clients
      const newLobbiesList = getLobbies();
      sendDataToClients(clients, GET_LOBBIES, newLobbiesList);
      const connectedUsers = getConnectedUsers();
      sendDataToClients(clients, GET_CONNECTED_USERS, connectedUsers);
    }

    default:
      break;
  }
}

function handleWebSocketDisconnection(socket) {
  let self = getSelf(socket);

  // if client is in a lobby, leave the lobby
  if (self.lobby) {
    // if client was the creator of the lobby, leaveLobby() returns a list of the rest of the
    // users who were connected to the lobby so that we can update their lobby value
    // (set back to 0, which is the main lobby)
    const result = leaveLobby(self, self.lobby);

    if (result) {
      result.forEach((user) => {
        const userSocket = getSocketByUser(user);
        const updatedUser = updateUserLobby(userSocket, 0);
        sendDataToClient(userSocket, GET_SELF, updatedUser);
      });
    }

    // send updated list of lobbies and connected users to all clients
    const newLobbiesList = getLobbies();
    sendDataToClients(clients, GET_LOBBIES, newLobbiesList);
  }
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
