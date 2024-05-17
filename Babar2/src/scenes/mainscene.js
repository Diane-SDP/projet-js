import Phaser from 'phaser';
import { Scene } from "phaser";
import { Player } from "../GameObjects/player";
import { Ennemy } from "../GameObjects/ennemy";
export class MainScene extends Scene {
    player = null;
    bokoblin = null;
    Maze = []
    MazeHeight = 4;
    MazeWidth = 4;
    constructor() {
        super('main');
    }

    preload() {
        this.load.image('background', './public/assets/wallpaper.jpg');
        this.load.image("player",'./public/assets/player.png')
        this.load.image("bokoblin",'./public/assets/bokoblin.png')

    }

    create() {

        console.log("pute");
        this.player = new Player({ scene: this });
        this.bokoblin = new Ennemy({scene: this})
        this.cursors = this.input.keyboard.createCursorKeys();
        this.Maze = [
            ["X","X","O","X"],
            ["O","X","O","X"],
            ["O","X","O","X"],
            ["X","X","X","X"]
        ]
        this.player.Maze = this.Maze
        // this.add.image(400, 300, 'background');
        // background.setOrigin(0, 0); // Set origin to the top-left corner
        //background.setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);
    }
    update() {
        
        this.player.update();
        this.bokoblin.update();
        var direction = []
        if (this.cursors.up.isDown) {
            direction.push("up")
        }
        if (this.cursors.down.isDown) {
            direction.push("down")
        }
        if (this.cursors.right.isDown) {
            direction.push("right")
        }
        if (this.cursors.left.isDown) {
            direction.push("left")
        }
        if (this.cursors.space.isDown){
            if(this.player.CanDash == true){
                this.player.CanDash = false
                this.player.velocity = 20
                setTimeout(() => {
                    this.player.velocity = 5
                    setTimeout(() => {
                        this.player.CanDash = true;
                    }, 700);
                }, 100);
            }

            
        }
        if (this.input.mousePointer.isDown && this.player.CanAttack){
            console.log('test')
            
            this.player.CanAttack = false
            this.player.Attack(this.input.mousePointer.getDistanceX(),this.input.mousePointer.getDistanceY())
            setTimeout(() => {
                this.player.CanAttack = true;
            }, 200);
        }
        this.player.move(direction)

        
    }
}
