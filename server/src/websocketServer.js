const WebSocket = require("ws");
const { handleWebSocketConnection } = require("./websocketHandler");

const server = new WebSocket.Server({ port: 3000 });

server.on("connection", handleWebSocketConnection);

module.exports = server;
