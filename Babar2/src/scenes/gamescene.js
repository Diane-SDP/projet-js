import Phaser from 'phaser';
import { Scene } from "phaser";
import { Player } from "../GameObjects/player";
import { LabyrinthGenerator } from "./labyrinthGenerator";
import { Ennemy } from "../GameObjects/ennemy";
export class GameScene extends Scene {
    player = null;
    bokoblin = null;
    Maze = []
    MazeHeight = 4;
    MazeWidth = 4;
    constructor() {
        super('game');
    }

    preload() {
        this.load.image('background', './public/assets/wallpaper.jpg');
        this.load.image("player",'./public/assets/player.png')
        this.load.image("bokoblin",'./public/assets/bokoblin.png')
        this.load.image("FullHeart",'./public/assets/HearthFull.png')
        this.load.image("MidHeart",'./public/assets/HearthMid.png')
        this.load.image("EmptyHeart",'./public/assets/HearthEmpty.png')

    }

    create() {


        this.player = new Player({ scene: this });
        this.bokoblin = new Ennemy({scene: this}).setScale(0.75)
        // this.bokoblin.setScale(0.75)


        this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = this.input.keyboard.addKeys({
            'Z': Phaser.Input.Keyboard.KeyCodes.Z,
            'Q': Phaser.Input.Keyboard.KeyCodes.Q,
            'S': Phaser.Input.Keyboard.KeyCodes.S,
            'D': Phaser.Input.Keyboard.KeyCodes.D
        });
        this.input.on('pointerdown', (pointer) => {
            if (pointer.button === 0 && this.player.CanAttack) {
                this.player.CanAttack = false
                this.player.Attack(this.input.mousePointer.downX,this.input.mousePointer.downY,this.bokoblin)
            } else if (pointer.button === 2) {
                if(this.player.CanDash == true){
                    this.player.CanDash = false
                    this.player.velocity = 20
                    setTimeout(() => {
                        this.player.velocity = 5
                        setTimeout(() => {
                            this.player.CanDash = true;
                        }, 500);
                    }, 100);
                }
            }
        });

        this.input.mouse.disableContextMenu();

        const width = 20;
        const height = 20;
        const tileSize = 50; 
        const generator = new LabyrinthGenerator(width, height);
        const Maze = generator.generateLabyrinth(); //matrice avec 0 si c'est un sol, 1 si c'est un mur (taille : 10x10)

        // this.Maze = [
        //     ["X","X","O","X"],
        //     ["O","X","O","X"],
        //     ["O","X","O","X"],
        //     ["X","X","X","X"]
        // ]


        this.player.Maze = Maze
        this.player.bokoblin = this.bokoblin

        this.physics.add.collider(this.player,this.bokoblin)
        this.player.UpdateHealth()
    }

    
    update() {
        
        this.player.update();
        this.bokoblin.update();
        var direction = []
        if (this.cursors.up.isDown || this.keys.Z.isDown) {
            direction.push("up");
        }
        if (this.cursors.down.isDown || this.keys.S.isDown) {
            direction.push("down");
        }
        if (this.cursors.right.isDown || this.keys.D.isDown) {
            direction.push("right");
        }
        if (this.cursors.left.isDown || this.keys.Q.isDown) {
            direction.push("left");
        }

        this.player.move(direction)
        this.bokoblin.Move(this.player)
        
    }

    
}
