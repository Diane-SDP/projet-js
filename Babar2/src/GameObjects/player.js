import { GameObjects,Physics } from "phaser";

export class Player extends Physics.Arcade.Image {
    state = "waiting";
    CanDash = true
    CanAttack = true
    velocity = 5;
    size = 50;
    MazeX = 0;
    MazeY = 0;
    MazeMaxX = 4;
    MazeMaxY = 4;
    Direction = []
    // Maze = []
    constructor({scene}) {
        super(scene, 200, 100, "player");
        this.scene = scene;
        this.Maze = []
        this.scene.add.existing(this);
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
                if(this.MazeY != 0){
                    if(this.Maze[this.MazeY-1][this.MazeX] == "X"){
                        this.y = 540-this.size
                        this.MazeY--;
                    }
                }
                break;
            case "down":
                if(this.MazeY != this.MazeMaxY-1){
                    if(this.Maze[this.MazeY+1][this.MazeX] == "X"){
                        this.y = 0+this.size
                        this.MazeY++;
                    }

                }
                break;
            case "left":
                if(this.MazeX != 0){
                    if(this.Maze[this.MazeY][this.MazeX-1] == "X"){
                        this.x = 960-this.size
                        this.MazeX--;
                    }
                }
                break;
            case "right":
                if(this.MazeX != this.MazeMaxX-1){
                    if(this.Maze[this.MazeY][this.MazeX+1] == "X"){

                        this.x = 0+this.size
                        this.MazeX++;
                    }
                }
                break;
            default:
                break;
        }
    }
    Attack(mouseX,mouseY){
        console.log(mouseX,mouseY)
    }
}