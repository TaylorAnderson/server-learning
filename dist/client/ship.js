"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ship = void 0;
require("phaser");
class Ship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, isEnemy) {
        super(scene, x, y, isEnemy ? 'enemy-ship' : 'ship');
        this.isEnemy = isEnemy;
        /**
         *
         */
        this.velocity = new Phaser.Math.Vector2(0, 0);
        this.accel = 0.1;
        this.rotateSpeed = 7;
        if (!this.isEnemy) {
            this.cursors = scene.input.keyboard.createCursorKeys();
        }
        this.scale = 0.3;
    }
    update() {
        this.scene.physics.world.wrap(this);
        console.log('update');
        if (this.isEnemy)
            return;
        if (this.cursors.left.isDown) {
            this.angle -= this.rotateSpeed;
        }
        if (this.cursors.right.isDown) {
            this.angle += this.rotateSpeed;
        }
        this.velocity.scale(0.99);
        if (this.cursors.up.isDown) {
            let dir = new Phaser.Math.Vector2(Math.cos(this.rotation + Math.PI / 2), Math.sin(this.rotation + Math.PI / 2));
            dir.normalize();
            dir.scale(this.accel);
            this.velocity.add(dir);
        }
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}
exports.Ship = Ship;
//# sourceMappingURL=ship.js.map