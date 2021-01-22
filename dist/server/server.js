"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const socketio = __importStar(require("socket.io"));
const express_1 = __importDefault(require("express"));
const http = __importStar(require("http"));
let io = new socketio.Server();
let players = {};
let scores = {
    blue: 0,
    red: 0
};
const app = express_1.default();
const server = http.createServer(app);
io.listen(server);
let port = process.env.PORT || 8000;
app.set("port", port);
app.get("/", (req, res) => {
    res.sendFile(path.resolve("./src/client/index.html"));
});
io.on("connection", (socket) => {
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
    socket.broadcast.emit("newPlayer", players[socket.id]);
    socket.on("disconnect", () => {
        delete players[socket.id];
        io.emit("delete", socket.id);
    });
    socket.on("playerMovement", (movementData) => {
        let player = players[socket.id];
        player.x = movementData.x;
        player.y = movementData.y;
        player.rotation = movementData.rotation;
        socket.broadcast.emit("playerMoved", player);
    });
});
server.listen(port, function () {
    console.log("listening on " + port);
});
app.use(express_1.default.static(path.join(__dirname, "../client")));
//# sourceMappingURL=server.js.map