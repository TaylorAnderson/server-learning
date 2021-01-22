import { PlayerConfig, PlayerMovementData } from './../shared/model/player';
import * as Socket_Client from "socket.io-client"
import * as Phaser from "phaser"
import * as _ from "lodash"
import { IBodyRenderOptionsSprite } from 'matter';
import { Ship } from './ship';
interface OtherPlayer {
  go:Phaser.GameObjects.GameObject,
  id:string
}
export class TestScene extends Phaser.Scene {

  /**
   *
   */

  private socket:SocketIOClient.Socket
  private ship:Ship;
  private otherPlayers:Ship[] = [];
  private cursors:Phaser.Types.Input.Keyboard.CursorKeys;
  private angle = 0;
  private oldPos:PlayerMovementData = {x: 0, y: 0, rotation: 0};
  private currentPos:PlayerMovementData = {x: 0, y: 0, rotation: 0};
  private blueScoreText:Phaser.GameObjects.Text;
  private redScoreText:Phaser.GameObjects.Text;
  constructor() {
    super({key: "TestScene"});
    
  }
  preload() {
    this.load.image('ship', './ship.png');
    this.load.image('enemy-ship', './enemy-ship.png');
    this.load.image('star', './star.png');
  }

  create() {
    this.socket = Socket_Client.connect()
    this.socket.on("currentPlayers", (players:any) => {
      Object.keys(players).forEach(id => {
        if (id == this.socket.id) {
          this.addPlayer(players[id])
        }
        else {
          this.addOtherPlayers(players[id]);
        }
      })
    });
    this.socket.on("newPlayer", (player:PlayerConfig) => {
      this.addOtherPlayers(player);
    });
    this.socket.on("delete", (playerId:string) => {
      this.otherPlayers.forEach(otherPlayer => {
        if (otherPlayer.name == playerId) {
          otherPlayer.destroy();
        }
      });
    })
    this.socket.on("playerMoved", (player:PlayerConfig) => {
      this.otherPlayers.forEach(function (otherPlayer) {
        if (player.playerId === otherPlayer.name) {
          console.log('setting position + rotation');
          otherPlayer.setRotation(player.rotation);
          otherPlayer.setPosition(player.x, player.y);
        }
      });
    })

    this.blueScoreText = this.add.text(16, 16, '', { fontSize: '32px', color: '#0000FF' });
    this.redScoreText = this.add.text(544, 16, '', { fontSize: '32px', color: '#FF0000' });
      
    this.socket.on('scoreUpdate', (scores:any) => {
      this.blueScoreText.setText('Blue: ' + scores.blue);
      this.redScoreText.setText('Red: ' + scores.red);
    });

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    if (this.ship) {
      this.ship.update();
      this.currentPos.x = this.ship.x
      this.currentPos.y = this.ship.y
      this.currentPos.rotation = this.ship.rotation;

      if (this.oldPos.x != this.currentPos.x || this.oldPos.y != this.currentPos.y || this.oldPos.rotation != this.currentPos.rotation) {
        this.socket.emit('playerMovement', this.currentPos)
      }
      this.oldPos.x = this.currentPos.x;
      this.oldPos.y = this.currentPos.y;
      this.oldPos.rotation = this.currentPos.rotation;
      
    }
  }
  addPlayer = (config:PlayerConfig) => {
    this.ship = new Ship(this, config.x, config.y, false);
    this.add.existing(this.ship);
    if (config.team === 'blue') {
      this.ship.setTint(0x0000ff);
    } else {
      this.ship.setTint(0xff0000);
    }
  }
  addOtherPlayers(config:PlayerConfig) {
    const otherPlayer = new Ship(this, config.x, config.y, true);
    this.add.existing(otherPlayer);
    if (config.team === 'blue') {
      otherPlayer.setTint(0xaaaaff);
    } else {
      otherPlayer.setTint(0xffaaaa);
    }
    this.otherPlayers.push(otherPlayer);
    otherPlayer.name = config.playerId;
  }
}