import Phaser from 'phaser';
import { Scene } from "phaser";
import { Player } from "../GameObjects/player";
export class MainScene extends Scene {
    player = null;
    Maze = []
    constructor() {
        super('main');
    }

    preload() {
        this.load.image('background', './public/assets/wallpaper.jpg');
        this.load.image("player",'./public/assets/player.png')
    }

    create() {
        console.log("pute");
        this.player = new Player({ scene: this });
        this.cursors = this.input.keyboard.createCursorKeys();
        // this.add.image(400, 300, 'background');
        // background.setOrigin(0, 0); // Set origin to the top-left corner
        //background.setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);
    }
    update() {
        this.Maze = [
            ["X","X","O","X"],
            ["O","X","O","X"],
            ["O","X","O","X"],
            ["X","X","X","X"]
        ]
        this.player.update();
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
            if(this.player.Dash == true){
                this.player.Dash = false
                this.player.velocity = 20
                setTimeout(() => {
                    this.player.velocity = 5
                    setTimeout(() => {
                        this.player.Dash = true;
                    }, 1000);
                }, 100);
            }

            
        }
        this.player.move(direction)

        
    }
}
