/*
  Lobby
    lobbyId
    creatorId (userId)
    lobbyName
    Users (list of users)
    settings {
      gameTimer
      randomizeSwitch
    }
    lobbyState
    user1Score
    user2Score
    lightState
    gameTimer

  
  Lobbies
    key: lobbyId
    value: lobby
*/

const MAXIMUM_LOBBY_SIZE = 4;

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

function getTakenColors(lobby) {
  const connectedUsers = lobby.connectedUsers;
  const takenColors = [];

  for (let index = 0; index < connectedUsers.length; index++) {
    const user = connectedUsers[index];
    takenColors.push(user.color);
  }

  return takenColors;
}

function findFirstAvailableColor(lobby) {
  const takenColors = getTakenColors(lobby);

  let color = 0;
  while (takenColors.includes(color)) {
    color++;
  }
  return color;
}

function joinLobby(self, lobbyId) {
  const lobby = lobbies.get(lobbyId);

  if (lobby.connectedUsers.length >= MAXIMUM_LOBBY_SIZE) {
    return;
  }

  lobby.connectedUsers.push({
    ...self,
    readyStatus: false,
    color: findFirstAvailableColor(lobby),
  });
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
    connectedUsers: [{ ...self, readyStatus: true, color: 0 }],
    settings: {
      gameTimer: 60,
      randomizeSwitch: false,
    },
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

function updateLobbyGameTimer(self, lobbyId, newTimer) {
  const lobby = lobbies.get(lobbyId);

  if (self.userId !== lobby.creatorId) {
    return;
  }

  const updatedLobbySettings = {
    ...lobby.settings,
    gameTimer: newTimer,
  };
  const updatedLobby = {
    ...lobby,
    settings: updatedLobbySettings,
  };

  lobbies.set(lobbyId, updatedLobby);
  return updatedLobby;
}

function toggleLobbyRandomizeSwitch(self, lobbyId) {
  const lobby = lobbies.get(lobbyId);
  const prevRandomizeSwitch = lobby.settings.randomizeSwitch;

  if (self.userId !== lobby.creatorId) {
    return;
  }

  const updatedLobbySettings = {
    ...lobby.settings,
    randomizeSwitch: !prevRandomizeSwitch,
  };
  const updatedLobby = {
    ...lobby,
    settings: updatedLobbySettings,
  };

  lobbies.set(lobbyId, updatedLobby);
  return updatedLobby;
}

function toggleLobbyPlayerReadyStatus(self, lobbyId, index) {
  const lobby = lobbies.get(lobbyId);

  let updatedPlayer = lobby.connectedUsers[index];
  const prevReadyStatus = updatedPlayer.readyStatus;

  if (self.userId !== updatedPlayer.userId) {
    return;
  }

  updatedPlayer = {
    ...updatedPlayer,
    readyStatus: !prevReadyStatus,
  };

  const updatedPlayers = [...lobby.connectedUsers];
  updatedPlayers[index] = updatedPlayer;

  const updatedLobby = {
    ...lobby,
    connectedUsers: updatedPlayers,
  };
  lobbies.set(lobbyId, updatedLobby);
  return updatedLobby;
}

function updateLobbyPlayerColorChoice(self, lobbyId, index, newColor) {
  const lobby = lobbies.get(lobbyId);
  const takenColors = getTakenColors(lobby);

  if (takenColors.includes(newColor)) {
    return;
  }

  let updatedPlayer = lobby.connectedUsers[index];

  if (self.userId !== updatedPlayer.userId) {
    return;
  }

  updatedPlayer = {
    ...updatedPlayer,
    color: newColor,
  };

  const updatedPlayers = [...lobby.connectedUsers];
  updatedPlayers[index] = updatedPlayer;

  const updatedLobby = {
    ...lobby,
    connectedUsers: updatedPlayers,
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
  updateLobbyGameTimer,
  toggleLobbyRandomizeSwitch,
  toggleLobbyPlayerReadyStatus,
  updateLobbyPlayerColorChoice,
  deleteLobby,
  printLobbies,
};
