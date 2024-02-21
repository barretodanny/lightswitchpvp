const WebSocket = require("ws");
const {
  connectNewUser,
  disconnectUser,
  getConnectedUsers,
  updateUsername,
} = require("./user");
const {} = require("./lobby");

const server = new WebSocket.Server({ port: 3000 });
let clients = [];

// handle client connecting to server
server.on("connection", (socket) => {
  clients.push(socket);

  // send client self obj
  const self = connectNewUser(socket);
  let res = {
    type: "GET_SELF",
    data: self,
  };
  socket.send(JSON.stringify(res));

  // send all connected clients an updated list of connected users
  clients.forEach((client) => {
    // send client list of connected users
    const connectedUsers = getConnectedUsers();
    res = {
      type: "GET_CONNECTED_USERS",
      data: connectedUsers,
    };
    client.send(JSON.stringify(res));
  });

  // handle message
  socket.on("message", (msg) => {
    const req = JSON.parse(msg);

    if (req.type === "UPDATE_USERNAME") {
      updateUsername(socket, req.payload);

      // send all connected clients an updated list of connected users
      clients.forEach((client) => {
        // send client list of connected users
        const connectedUsers = getConnectedUsers();
        res = {
          type: "GET_CONNECTED_USERS",
          data: connectedUsers,
        };
        client.send(JSON.stringify(res));
      });
    }
  });

  // handle client disconnection
  socket.on("close", () => {
    // disconnect user
    disconnectUser(socket);

    // remove client socket from list of clients
    clients = clients.filter((client) => client !== socket);

    // send all connected clients an updated list of connected users
    clients.forEach((client) => {
      // send client list of connected users
      const connectedUsers = getConnectedUsers();
      res = {
        type: "GET_CONNECTED_USERS",
        data: connectedUsers,
      };
      client.send(JSON.stringify(res));
    });
  });
});
