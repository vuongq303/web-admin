var app = require("../app");
var http = require("http");
const { WebSocketServer } = require("ws");
const mysql = require("../bin/connect");

var port = process.env.PORT || "3000";

mysql.connect(function (err) {
  if (err) throw err;
  console.log("Connected to database");
});

var server = http.createServer(app);
const websocket = new WebSocketServer({ server: server, clientTracking: true });

websocket.on("connection", function connection(ws) {
  ws.on("error", console.error);
  console.log("user connected");

  ws.on("message", function message(data) {
    const json = data.toString("utf8");
    websocket.clients.forEach((client) => {
      client.send(json);
    });
  });

  ws.on("close", () => {
    console.log("user disconnected");
  });
});

server.listen(port, () => console.log("Running in port " + port));
