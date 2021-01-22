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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestScene = void 0;
const Socket_Client = __importStar(require("socket.io-client"));
const Phaser = __importStar(require("phaser"));
const ship_1 = require("./ship");
class TestScene extends Phaser.Scene {
    constructor() {
        super({ key: "TestScene" });
        this.otherPlayers = [];
        this.angle = 0;
        this.oldPos = { x: 0, y: 0, rotation: 0 };
        this.currentPos = { x: 0, y: 0, rotation: 0 };
        this.addPlayer = (config) => {
            this.ship = new ship_1.Ship(this, config.x, config.y, false);
            this.add.existing(this.ship);
            if (config.team === 'blue') {
                this.ship.setTint(0x0000ff);
            }
            else {
                this.ship.setTint(0xff0000);
            }
        };
    }
    preload() {
        this.load.image('ship', './ship.png');
        this.load.image('enemy-ship', './enemy-ship.png');
        this.load.image('star', './star.png');
    }
    create() {
        this.socket = Socket_Client.connect();
        this.socket.on("currentPlayers", (players) => {
            Object.keys(players).forEach(id => {
                if (id == this.socket.id) {
                    this.addPlayer(players[id]);
                }
                else {
                    this.addOtherPlayers(players[id]);
                }
            });
        });
        this.socket.on("newPlayer", (player) => {
            this.addOtherPlayers(player);
        });
        this.socket.on("delete", (playerId) => {
            this.otherPlayers.forEach(otherPlayer => {
                if (otherPlayer.name == playerId) {
                    otherPlayer.destroy();
                }
            });
        });
        this.socket.on("playerMoved", (player) => {
            this.otherPlayers.forEach(function (otherPlayer) {
                if (player.playerId === otherPlayer.name) {
                    console.log('setting position + rotation');
                    otherPlayer.setRotation(player.rotation);
                    otherPlayer.setPosition(player.x, player.y);
                }
            });
        });
        this.blueScoreText = this.add.text(16, 16, '', { fontSize: '32px', color: '#0000FF' });
        this.redScoreText = this.add.text(544, 16, '', { fontSize: '32px', color: '#FF0000' });
        this.socket.on('scoreUpdate', (scores) => {
            this.blueScoreText.setText('Blue: ' + scores.blue);
            this.redScoreText.setText('Red: ' + scores.red);
        });
        this.cursors = this.input.keyboard.createCursorKeys();
    }
    update() {
        if (this.ship) {
            this.ship.update();
            this.currentPos.x = this.ship.x;
            this.currentPos.y = this.ship.y;
            this.currentPos.rotation = this.ship.rotation;
            if (this.oldPos.x != this.currentPos.x || this.oldPos.y != this.currentPos.y || this.oldPos.rotation != this.currentPos.rotation) {
                this.socket.emit('playerMovement', this.currentPos);
            }
            this.oldPos.x = this.currentPos.x;
            this.oldPos.y = this.currentPos.y;
            this.oldPos.rotation = this.currentPos.rotation;
        }
    }
    addOtherPlayers(config) {
        const otherPlayer = new ship_1.Ship(this, config.x, config.y, true);
        this.add.existing(otherPlayer);
        if (config.team === 'blue') {
            otherPlayer.setTint(0xaaaaff);
        }
        else {
            otherPlayer.setTint(0xffaaaa);
        }
        this.otherPlayers.push(otherPlayer);
        otherPlayer.name = config.playerId;
    }
}
exports.TestScene = TestScene;
//# sourceMappingURL=test-scene.js.map