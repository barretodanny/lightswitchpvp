const websocketServer = require("./websocketServer");

websocketServer.on("listening", () => {
  console.log("Websocket server started on port 3000");
});
