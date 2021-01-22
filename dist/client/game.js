"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const test_scene_1 = require("./test-scene");
require("phaser");
const config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    parent: 'game',
    scene: [test_scene_1.TestScene],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { x: 0, y: 0 }
        }
    },
};
class Game extends Phaser.Game {
    constructor(config) {
        super(config);
    }
}
exports.Game = Game;
const game = new Game(config);
//# sourceMappingURL=game.js.map