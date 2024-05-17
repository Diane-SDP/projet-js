import { GameObjects,Physics } from "phaser";

export class Player extends Physics.Arcade.Image {
    state = "waiting";
    Dash = true
    velocity = 5;
    size = 50;
    MazeX = 0;
    MazeY = 0;
    constructor({scene}) {
        super(scene, 200, 100, "player");
        this.scene = scene;
        this.scene.add.existing(this);
    }
    start() {
        this.state = "start";
    }
    move(direction) {
        for(var i = 0 ; i < direction.length;i++){
            switch (direction[i]) {
                case "up":
                    if (this.y > 0 +this.size){
                        this.y -= this.velocity;
                    }else {
                        this.SwitchRoom(direction[i])
                    }
                    break;
                case "down":
                    if (this.y < 540 -this.size){
                        this.y += this.velocity;
                    }else {
                        this.SwitchRoom(direction[i])
                    }
                    break;
                case "left":
                    if (this.x > 0 +this.size){
                        this.x-=this.velocity
                    }else {
                        this.SwitchRoom(direction[i])
                    }
                    break;
                case "right":
                    if ( this.x < 960 -this.size){
                        this.x+=this.velocity
                    }else {
                        this.SwitchRoom(direction[i])
                    }
                    break;
                default:
                    break;
            }
        }
    }
    SwitchRoom(direction){
        switch (direction) {
            case "up":
                this.y = 540-this.size
                this.x = 960/2+this.size
                break;
            case "down":
                this.y = 0+this.size
                this.x = 960/2+this.size
                break;
            case "left":
                this.y = 540/2+this.size
                this.x = 0+this.size

                break;
            case "right":
                this.y = 540/2+this.size
                this.x = 960-this.size
                break;
            default:
                break;
        }
    }
}