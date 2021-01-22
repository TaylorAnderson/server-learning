import { Player, PlayerConfig, PlayerMovementData } from './../shared/model/player';
import * as path from "path"
import * as socketio from 'socket.io';
import express, { Express, Request, Response } from 'express';
import * as http from 'http';
import * as _ from "lodash"
let io:socketio.Server = new socketio.Server();

let players:any = {}
let scores = {
  blue:0,
  red: 0
}

const app:Express = express()

const server:http.Server = http.createServer(app);

io.listen(server);

let port = process.env.PORT || 8000

app.set("port", port)

app.get("/", (req: any, res: any) => {
  res.sendFile(path.resolve("./src/client/index.html"))
})

io.on("connection", (socket:socketio.Socket) => {
  players[socket.id] = {
    rotation: 0,
    x: Math.floor(Math.random() * 640),
    y: Math.floor(Math.random() * 480),
    playerId: socket.id,
    team: (Math.floor(Math.random() * 2) == 0) ? 'red' : 'blue'
  };

  socket.emit("currentPlayers", players);
  // send the current scores
  socket.emit('scoreUpdate', scores);

  socket.broadcast.emit("newPlayer", players[socket.id])

  socket.on("disconnect", () => {
    delete players[socket.id]
    io.emit("delete", socket.id);
  });

  socket.on("playerMovement", (movementData:PlayerMovementData) => {
    let player = players[socket.id]
    player.x = movementData.x;
    player.y = movementData.y;
    player.rotation = movementData.rotation
    socket.broadcast.emit("playerMoved", player);
  })
})

server.listen(port, function() {
  console.log("listening on " + port)
})

app.use(express.static(path.join(__dirname, "../client")))