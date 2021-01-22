import { isElement } from "lodash";
import "phaser"
import { PlayerMovementData } from "~shared/model/player";
export class Ship extends Phaser.GameObjects.Sprite {
  /**
   *
   */
  private velocity:Phaser.Math.Vector2 = new Phaser.Math.Vector2(0, 0);
  private cursors:Phaser.Types.Input.Keyboard.CursorKeys;
  private accel:number = 0.1;
  private rotateSpeed = 7;
  constructor(scene:Phaser.Scene, x:number, y:number, private isEnemy:boolean) {
    super(scene, x, y, isEnemy ? 'enemy-ship' : 'ship');
    if (!this.isEnemy) {
      this.cursors = scene.input.keyboard.createCursorKeys();
    }
    this.scale = 0.3;
  }
  update() {
    this.scene.physics.world.wrap(this);
    console.log('update');
    if (this.isEnemy) return;

    if (this.cursors.left.isDown) {
      this.angle-=this.rotateSpeed;
    }
    if (this.cursors.right.isDown) {
      this.angle+=this.rotateSpeed
    }
    this.velocity.scale(0.99);
    if (this.cursors.up.isDown) {
      let dir = new Phaser.Math.Vector2(Math.cos(this.rotation + Math.PI/2), Math.sin(this.rotation + Math.PI/2))
      dir.normalize();
      dir.scale(this.accel);

      this.velocity.add(dir);
    }
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}