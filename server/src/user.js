/*
  User
    userId
    username
    lobby (lobbyId)
  

  Users
    key: socket
    value: user
*/

users = new Map();
let nextUserId = 1;

function connectNewUser(socket) {
  const user = {
    userId: nextUserId++,
    username: "anonymous",
    lobby: 0,
  };

  users.set(socket, user);
  return user;
}

function disconnectUser(socket) {
  users.delete(socket);
}

function getConnectedUsers() {
  const connectedUsers = [];

  users.forEach((user) => {
    connectedUsers.push(user);
  });
  return connectedUsers;
}

function getSelf(socket) {
  return users.get(socket);
}

function getSocketByUser(user) {
  const userId = user.userId;
  for (let [socket, user] of users.entries()) {
    if (user.userId === userId) {
      return socket;
    }
  }

  return null;
}

function updateUsername(socket, newUsername) {
  const user = users.get(socket);
  const updatedUser = {
    ...user,
    username: newUsername,
  };
  users.set(socket, updatedUser);
  return updatedUser;
}

function updateUserLobby(socket, lobbyId) {
  const user = users.get(socket);
  const updatedUser = {
    ...user,
    lobby: lobbyId,
  };
  users.set(socket, updatedUser);
  return updatedUser;
}

function printUsers() {
  if (users.size < 1) {
    console.log("No users found.");
    return;
  }

  console.log("Users:");
  users.forEach((user) => {
    console.log(
      `userId: ${user.userId} - username: ${user.username} - lobby: ${user.lobby}`
    );
  });
}

module.exports = {
  connectNewUser,
  disconnectUser,
  getConnectedUsers,
  getSelf,
  getSocketByUser,
  updateUsername,
  updateUserLobby,
  printUsers,
};
