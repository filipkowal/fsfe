const express = require("express");
const server = require("http").createServer(express);
const app = express();

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname });
});

server.on("request", app);
server.listen(3000, () => {
  console.log("Server started on port 3000");
});

// Begin websocket
const WebSockeServer = require("ws").Server;

const wss = new WebSockeServer({ server });

wss.on("connection", (ws) => {
  const numCients = wss.clients.size;
  console.log(`New client connected. Total clients: ${numCients}`);

  wss.broadcast("Current visitors: " + numCients);

  if (ws.readyState === ws.OPEN) {
    ws.send("Welcome to my server!");
  }

  ws.on("close", () => {
    console.log("Client disconnected");
    wss.broadcast("Client disconnected. Current visitors: " + numCients);
  });
});

wss.broadcast = function broadcast(data) {
  wss.clients.forEach((client) => {
    client.send(data);
  });
};
