/*
  Lobby
    lobbyId
    creatorId (userId)
    lobbyName
    Users (list of usersockets)
    lobbyState
    user1Score
    user2Score
    lightState
    gameTimer

  
  Lobbies
    key: lobbyId
    value: lobby
*/

lobbies = new Map();
let nextLobbyId = 1;

function getLobbies() {
  const lobbyList = [];
  lobbies.forEach((lobby) => {
    lobbyList.push(lobby);
  });
  return lobbyList;
}

function getCurrentLobby(self) {
  return lobbies.get(self.lobby);
}

function joinLobby(self, lobbyId) {
  const lobby = lobbies.get(lobbyId);
  lobby.connectedUsers.push(self);
  return lobby;
}

function leaveLobby(self, lobbyId) {
  const lobby = lobbies.get(lobbyId);
  const userId = self.userId;

  const filteredConnectedUsers = lobby.connectedUsers.filter(
    (user) => user.userId !== userId
  );

  if (userId === lobby.creatorId) {
    deleteLobby(lobbyId);
    return filteredConnectedUsers;
  }

  lobbies.set(lobbyId, {
    ...lobby,
    connectedUsers: filteredConnectedUsers,
  });

  return 0;
}

function createLobby(self, lobbyName) {
  const lobbyId = nextLobbyId++;

  const newLobby = {
    lobbyId,
    creatorId: self.userId,
    lobbyName,
    connectedUsers: [self],
    lobbyState: "SETUP",
    user1Score: 0,
    user2Score: 0,
    lightState: undefined,
    gameTimer: -1,
  };

  lobbies.set(lobbyId, newLobby);
  return newLobby;
}

function updateLobbyName(self, lobbyId, newLobbyName) {
  const lobby = lobbies.get(lobbyId);

  if (self.userId !== lobby.creatorId) {
    return;
  }

  const updatedLobby = {
    ...lobby,
    lobbyName: newLobbyName,
  };

  lobbies.set(lobbyId, updatedLobby);
  return updatedLobby;
}

function deleteLobby(lobbyId) {
  lobbies.delete(lobbyId);
}

function printLobbies() {
  if (lobbies.size < 1) {
    console.log("No lobbies found.");
    return;
  }

  console.log("Lobbies:");
  lobbies.forEach((lobby) => {
    console.log(
      `lobbyId: ${lobby.lobbyId} - lobbyName: ${lobby.lobbyName} - # connected users: ${lobby.connectedUsers.length}`
    );
  });
}

module.exports = {
  getLobbies,
  getCurrentLobby,
  joinLobby,
  leaveLobby,
  createLobby,
  updateLobbyName,
  deleteLobby,
  printLobbies,
};
