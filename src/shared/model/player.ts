export interface PlayerConfig {
  rotation:number,
  x:number,
  y:number,
  playerId:string,
  team:string
}

export interface PlayerMovementData {
  x:number,
  y:number,
  rotation:number
}

export class Player {
  private config:PlayerConfig
  constructor (config: PlayerConfig) {
    this.config = config;
  }
}
