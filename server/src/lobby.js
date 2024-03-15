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
    gameTimer
    scoringTime

  
  Lobbies
    key: lobbyId
    value: lobby
*/

const { SETUP, COUNTDOWN, GAME, POST_GAME } = require("./lobbyStates");

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

  if (lobby.lobbyState !== SETUP) {
    return;
  }

  lobby.connectedUsers.push({
    ...self,
    readyStatus: false,
    color: findFirstAvailableColor(lobby),
    score: 0,
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
    connectedUsers: [{ ...self, readyStatus: true, color: 0, score: 0 }],
    settings: {
      gameTimer: 60,
      randomizeSwitch: false,
    },
    lobbyState: SETUP,
    gameTimer: -1,
    currentColor: -1,
    scoringTime: 0,
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

function startLobbyCountdown(self, lobbyId) {
  const lobby = lobbies.get(lobbyId);

  if (self.userId !== lobby.creatorId) {
    return;
  }

  const updatedLobby = {
    ...lobby,
    lobbyState: COUNTDOWN,
  };

  lobbies.set(lobbyId, updatedLobby);
  return updatedLobby;
}

function startLobbyGame(self, lobbyId) {
  const lobby = lobbies.get(lobbyId);

  if (self.userId !== lobby.creatorId) {
    return;
  }

  const updatedLobby = {
    ...lobby,
    lobbyState: GAME,
    gameTimer: lobby.settings.gameTimer,
    currentColor: -1,
    scoringTime: 0,
  };

  lobbies.set(lobbyId, updatedLobby);
  return updatedLobby;
}

function lobbyPlayAgain(self, lobbyId) {
  const lobby = lobbies.get(lobbyId);

  if (self.userId !== lobby.creatorId) {
    return;
  }

  let updatedConnectedUsers = [...lobby.connectedUsers];
  for (let i = 0; i < updatedConnectedUsers.length; i++) {
    let updatedUser = updatedConnectedUsers[i];

    if (updatedUser.userId !== lobby.creatorId) {
      updatedUser.readyStatus = false;
    }
    updatedUser.score = 0;
    updatedConnectedUsers[i] = updatedUser;
  }

  const updatedLobby = {
    ...lobby,
    connectedUsers: updatedConnectedUsers,
    lobbyState: SETUP,
  };

  lobbies.set(lobbyId, updatedLobby);
  return updatedLobby;
}

function endLobbygame(lobbyId) {
  const lobby = lobbies.get(lobbyId);

  // update score for user whos currently scoring
  const now = Date.now();
  let scoringUser = undefined;
  let i;

  for (i = 0; i < lobby.connectedUsers.length; i++) {
    if (lobby.connectedUsers[i].color === lobby.currentColor) {
      scoringUser = lobby.connectedUsers[i];
      break;
    }
  }

  let updatedLobby = { ...lobby };

  if (scoringUser) {
    const score = now - lobby.scoringTime;
    scoringUser.score += score;

    const updatedConnectedUsers = [...updatedLobby.connectedUsers];
    updatedConnectedUsers[i] = scoringUser;
    updatedLobby = { ...updatedLobby, connectedUsers: updatedConnectedUsers };
  }

  updatedLobby = {
    ...lobby,
    lobbyState: POST_GAME,
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

function updateLobbyGameColor(self, lobbyId, index) {
  const lobby = lobbies.get(lobbyId);
  const user = lobby.connectedUsers[index];
  const now = Date.now();
  let scoringUser = undefined;
  let i;

  if (self.userId !== user.userId) {
    return;
  }

  for (i = 0; i < lobby.connectedUsers.length; i++) {
    if (lobby.connectedUsers[i].color === lobby.currentColor) {
      scoringUser = lobby.connectedUsers[i];
      break;
    }
  }

  let updatedLobby = { ...lobby };

  if (scoringUser) {
    const score = now - lobby.scoringTime;

    scoringUser.score += score;

    const updatedConnectedUsers = [...updatedLobby.connectedUsers];
    updatedConnectedUsers[i] = scoringUser;

    updatedLobby = { ...updatedLobby, connectedUsers: updatedConnectedUsers };
  }

  const newLobbyColor = user.color === lobby.currentColor ? -1 : user.color;
  updatedLobby = {
    ...updatedLobby,
    currentColor: newLobbyColor,
    scoringTime: newLobbyColor === -1 ? 0 : now,
  };

  // const updatedLobby = {
  //   ...lobby,
  //   currentColor: user.color,
  // };
  lobbies.set(lobbyId, updatedLobby);
  return updatedLobby;
}

function decrementLobbyGameTimer(lobbyId) {
  const lobby = lobbies.get(lobbyId);
  const newTime = lobby.gameTimer - 1;
  const now = Date.now();
  let scoringUser = undefined;
  let i;

  for (i = 0; i < lobby.connectedUsers.length; i++) {
    if (lobby.connectedUsers[i].color === lobby.currentColor) {
      scoringUser = lobby.connectedUsers[i];
      break;
    }
  }

  let updatedLobby = { ...lobby };

  if (scoringUser) {
    const score = now - lobby.scoringTime;
    scoringUser.score += score;

    const updatedConnectedUsers = [...updatedLobby.connectedUsers];
    updatedConnectedUsers[i] = scoringUser;
    updatedLobby = {
      ...updatedLobby,
      connectedUsers: updatedConnectedUsers,
      scoringTime: now,
    };
  }

  updatedLobby = {
    ...updatedLobby,
    gameTimer: newTime,
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
  startLobbyCountdown,
  startLobbyGame,
  endLobbygame,
  printLobbies,
  updateLobbyGameColor,
  decrementLobbyGameTimer,
  lobbyPlayAgain,
};
