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
  updateLobbyGameTimer,
  toggleLobbyRandomizeSwitch,
  toggleLobbyPlayerReadyStatus,
  updateLobbyPlayerColorChoice,
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
  UPDATE_LOBBY_NAME,
  UPDATE_LOBBY_GAME_TIMER,
  TOGGLE_LOBBY_RANDOMIZE_SWITCH,
  TOGGLE_LOBBY_PLAYER_READY_STATUS,
  UPDATE_LOBBY_PLAYER_COLOR_CHOICE,
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

      // send lobbydetails to client and all other clients in this lobby
      const usersConnectedToLobby = [];
      lobby.connectedUsers.forEach((user) => {
        const userSocket = getSocketByUser(user);
        usersConnectedToLobby.push(userSocket);
      });
      usersConnectedToLobby.push(socket);
      sendDataToClients(usersConnectedToLobby, GET_LOBBY, lobby);

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

      // non creator left, send remaining connected users updated lobby
      if (result === 0) {
        const lobby = getCurrentLobby(self);
        const usersConnectedToLobby = [];
        lobby.connectedUsers.forEach((user) => {
          const userSocket = getSocketByUser(user);
          usersConnectedToLobby.push(userSocket);
        });
        usersConnectedToLobby.push(socket);
        sendDataToClients(usersConnectedToLobby, GET_LOBBY, lobby);
      }
      // if creator, send the rest of the players in to lobby to main lobby
      else if (result.length > 0) {
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
      break;
    }
    case UPDATE_LOBBY_NAME: {
      const self = getSelf(socket);
      const updatedLobby = updateLobbyName(self, self.lobby, req.payload);

      if (updatedLobby) {
        const usersConnectedToLobby = [];
        updatedLobby.connectedUsers.forEach((user) => {
          const userSocket = getSocketByUser(user);
          usersConnectedToLobby.push(userSocket);
        });
        usersConnectedToLobby.push(socket);
        sendDataToClients(usersConnectedToLobby, GET_LOBBY, updatedLobby);

        const newLobbiesList = getLobbies();
        sendDataToClients(clients, GET_LOBBIES, newLobbiesList);
      }
      break;
    }
    case UPDATE_LOBBY_GAME_TIMER: {
      const self = getSelf(socket);
      const updatedLobby = updateLobbyGameTimer(self, self.lobby, req.payload);

      if (updatedLobby) {
        const usersConnectedToLobby = [];
        updatedLobby.connectedUsers.forEach((user) => {
          const userSocket = getSocketByUser(user);
          usersConnectedToLobby.push(userSocket);
        });
        usersConnectedToLobby.push(socket);
        sendDataToClients(usersConnectedToLobby, GET_LOBBY, updatedLobby);
      }
      break;
    }
    case TOGGLE_LOBBY_RANDOMIZE_SWITCH: {
      const self = getSelf(socket);
      const updatedLobby = toggleLobbyRandomizeSwitch(self, self.lobby);

      if (updatedLobby) {
        const usersConnectedToLobby = [];
        updatedLobby.connectedUsers.forEach((user) => {
          const userSocket = getSocketByUser(user);
          usersConnectedToLobby.push(userSocket);
        });
        usersConnectedToLobby.push(socket);
        sendDataToClients(usersConnectedToLobby, GET_LOBBY, updatedLobby);
      }
      break;
    }
    case TOGGLE_LOBBY_PLAYER_READY_STATUS: {
      const self = getSelf(socket);
      const updatedLobby = toggleLobbyPlayerReadyStatus(
        self,
        self.lobby,
        req.payload
      );

      if (updatedLobby) {
        const usersConnectedToLobby = [];
        updatedLobby.connectedUsers.forEach((user) => {
          const userSocket = getSocketByUser(user);
          usersConnectedToLobby.push(userSocket);
        });
        usersConnectedToLobby.push(socket);
        sendDataToClients(usersConnectedToLobby, GET_LOBBY, updatedLobby);
      }
      break;
    }
    case UPDATE_LOBBY_PLAYER_COLOR_CHOICE: {
      const self = getSelf(socket);
      const newColor = parseInt(req.payload.newColor);
      const index = req.payload.index;
      const updatedLobby = updateLobbyPlayerColorChoice(
        self,
        self.lobby,
        index,
        newColor
      );

      if (updatedLobby) {
        const usersConnectedToLobby = [];
        updatedLobby.connectedUsers.forEach((user) => {
          const userSocket = getSocketByUser(user);
          usersConnectedToLobby.push(userSocket);
        });
        usersConnectedToLobby.push(socket);
        sendDataToClients(usersConnectedToLobby, GET_LOBBY, updatedLobby);
      }
      break;
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

    // non creator left, send remaining connected users updated lobby
    if (result === 0) {
      const lobby = getCurrentLobby(self);
      const usersConnectedToLobby = [];
      lobby.connectedUsers.forEach((user) => {
        const userSocket = getSocketByUser(user);
        usersConnectedToLobby.push(userSocket);
      });
      usersConnectedToLobby.push(socket);
      sendDataToClients(usersConnectedToLobby, GET_LOBBY, lobby);
    } else if (result.length > 0) {
      // creator left
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
