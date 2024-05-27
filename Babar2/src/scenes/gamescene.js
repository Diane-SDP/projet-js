import Phaser from 'phaser';
import { Scene } from "phaser";
import { Player } from "../GameObjects/player";
import { LabyrinthGenerator } from "./labyrinthGenerator";
import { Ennemy } from "../GameObjects/ennemy";
import {GameOverScene} from "./gameoverscene"

import {global} from "../main"


export class GameScene extends Scene {
    player = null
    bokoblin = null
    Maze = []
    MazeHeight = 10
    MazeWidth = 10
    constructor() {
        super('game');
    }

    init(data) {
        this.selectedWeapon = data.weapon;
    }

    preload() {
        this.load.image('iceBG', './public/assets/ice.png')
        this.load.image('wall', './public/assets/wall.png')
        this.load.image('waterBG', './public/assets/waterBG.png')
        this.load.image('BG', './public/assets/BG.png')
        // this.load.image("player",'./public/assets/player.png')
        this.load.image("bokoblin",'./public/assets/bokoblin.png')
        this.load.image("FullHeart",'./public/assets/HearthFull.png')
        this.load.image("MidHeart",'./public/assets/HearthMid.png')
        this.load.image("EmptyHeart",'./public/assets/HearthEmpty.png')
        this.load.image("octorok",'./public/assets/OctoRok.png')
        this.load.image("rock",'./public/assets/rock.png')
        this.load.image("key","./public/assets/key.png")
        this.load.image("ganon","./public/assets/ganon.png")
        // this.load.atlas('a-player', './public/assets/spriteSheets/player.png', './src/animations/spritePlayer.json');
        this.load.spritesheet('player', './public/assets/spriteSheets/player.png', {
            frameWidth: 120,
            frameHeight: 126
        });

    }

    setBackground(backgroundKey) {
        if (this.currentBackground) {
            this.currentBackground.destroy()
        }
        this.currentBackground = this.add.image(0, 0, backgroundKey).setOrigin(0, 0).setDisplaySize(960, 540)
        this.currentBackground.setDepth(-1)
    }

    resetGame() {
        this.player = null
        this.bokoblin = null
        this.Maze = []
        this.MazeHeight = 10
        this.MazeWidth = 10
        this.mapGraphics = null
    }

    create() {
        this.walls = []
        this.resetGame()
        this.setBackground("BG")

        this.player = new Player({ scene: this, weapon: this.selectedWeapon, attackBonus: global.nbWeaponBonus, heartBonus: global.nbHeartBonus })
        this.bokoblin = new Ennemy({scene: this}).setScale(0.75)

        this.anims.create({
            key: 'walk-down',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 9 }),
            frameRate: 10,
            repeat: -1
        });
    
        this.anims.create({
            key: 'walk-left',
            frames: this.anims.generateFrameNumbers('player', { start: 10, end: 19 }),
            frameRate: 10,
            repeat: -1
        });
    
        this.anims.create({
            key: 'walk-right',
            frames: this.anims.generateFrameNumbers('player', { start: 30, end: 39 }),
            frameRate: 10,
            repeat: -1
        });
    
        this.anims.create({
            key: 'walk-up',
            frames: this.anims.generateFrameNumbers('player', { start: 20, end: 29 }),
            frameRate: 10,
            repeat: -1
        });
        
        // this.bokoblin.setScale(0.75)


        this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = this.input.keyboard.addKeys({
            'Z': Phaser.Input.Keyboard.KeyCodes.Z,
            'Q': Phaser.Input.Keyboard.KeyCodes.Q,
            'S': Phaser.Input.Keyboard.KeyCodes.S,
            'D': Phaser.Input.Keyboard.KeyCodes.D,
            'TAB' : Phaser.Input.Keyboard.KeyCodes.TAB
        });
        this.input.on('pointerdown', (pointer) => {
            if (pointer.button === 0 && this.player.CanAttack) {
                this.player.CanAttack = false
                this.player.Attack(this.input.mousePointer.downX,this.input.mousePointer.downY,this.Maze[this.player.MazeX][this.player.MazeY].Ennemies)
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

        const width = 10;
        const height = 10;
        const tileSize = 50; 
        const generator = new LabyrinthGenerator(width, height);
        this.Maze = generator.generateLabyrinth(); //matrice avec 0 si c'est un sol, 1 si c'est un mur (taille : 10x10)
        // this.Maze = [
        //     ["X","X","O","X"],
        //     ["O","X","O","X"],
        //     ["O","X","O","X"],
        //     ["X","X","X","X"]
        // ]

        this.player.Maze = this.Maze
        this.FillMonster()
        this.player.bokoblin = this.bokoblin
        this.currentEnnemy =this.Maze[0][0].Ennemies
        this.player.UpdateHealth()
        if (this.mapGraphics) {
            this.mapGraphics.clear();
        } else {
            this.mapGraphics = this.add.graphics();
        }

        this.checkWalls()

    }

    setVisitedCase(x, y) {
        if (x < 0 || y < 0 || x >= this.MazeWidth || y >= this.MazeHeight) return;

        this.Maze[y][x].visited = true;

        const nextRooms = [
            { x: x + 1, y: y },
            { x: x - 1, y: y },
            { x: x, y: y + 1 },
            { x: x, y: y - 1 }
        ];

        nextRooms.forEach(room => {
            if (room.x >= 0 && room.y >= 0 && room.x < this.MazeWidth && room.y < this.MazeHeight) {
                if (!this.Maze[room.y][room.x].visited) {
                    this.Maze[room.y][room.x].discovered = true;
                }
            }
        });
    }

    FillMonster(){
        for(var i = 0 ; i < this.Maze.length;i++){  
            for(var j = 0 ; j < this.Maze.length;j++){
                if (!this.Maze[j][i].wall && this.Maze[j][i].special != "key"){
                    var nbEnnemy = Math.floor(Math.random() * 3)+1
                    for(var k = 0 ; k < nbEnnemy;k++){
                        var WhichMob = Math.floor(Math.random() * 100)
                        if(WhichMob < 30){
                            var boko = new Ennemy({scene: this,type: "octorok"}).setScale(0.2)
                            boko.Player = this.player
                            this.Maze[i][j].Ennemies.push(boko)
                        }else {
                            var boko = new Ennemy({scene: this,type: "bokoblin"}).setScale(0.75)
                            boko.Player = this.player
                            this.Maze[i][j].Ennemies.push(boko)
                        }
                    }
                }
            }
        }
        this.Maze[0][0].Ennemies = []
    }
    
    update() {   
        for(var i = 0 ; i < this.Maze[this.player.MazeX][this.player.MazeY].Ennemies.length;i++){
            if(this.Maze[this.player.MazeX][this.player.MazeY].Ennemies[i] !== undefined){
                this.Maze[this.player.MazeX][this.player.MazeY].Ennemies[i].update(this.player)

            }
        } 
        this.player.update();
        // this.bokoblin.update();
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
        if (this.keys.TAB.isDown) {
            console.log("TAB")
            //this.displayMap();
            this.displayFullMap()
        } else {
            if (this.mapGraphics != null) {
                this.hideMap()
            }
        }

        this.player.move(direction)
        this.setVisitedCase(this.player.MazeX, this.player.MazeY)
        
    }

    displayWalls(position) { 
        switch (position) {
            case "up" :
                this.walls.push(this.add.image(0, 0, "wall").setOrigin(0, 0).setDisplaySize(960, 50))
                break
            case "down" :
                this.walls.push(this.add.image(0, 490, "wall").setOrigin(0, 0).setDisplaySize(960, 50))
                break
            case "right" :
                this.walls.push(this.add.image(910, 0, "wall").setOrigin(0, 0).setDisplaySize(50, 540))
                break
            case "left" :
                this.walls.push(this.add.image(0, 0, "wall").setOrigin(0, 0).setDisplaySize(50, 540))
                break
        }
    }

    checkWalls() {
        const { MazeX, MazeY } = this.player;

        if (MazeY - 1 < 0 || this.Maze[MazeY - 1][MazeX].wall) {
            this.displayWalls("up");
        }

        if (MazeY + 1 >= this.MazeHeight || this.Maze[MazeY + 1][MazeX].wall) {
            this.displayWalls("down");
        }

        if (MazeX + 1 >= this.MazeWidth || this.Maze[MazeY][MazeX + 1].wall) {
            this.displayWalls("right");
        }

        if (MazeX - 1 < 0 || this.Maze[MazeY][MazeX - 1].wall) {
            this.displayWalls("left");
        }
    }
    

    displayEnnemy(x,y){
        for(var i = 0 ; i < this.Maze[x][y].Ennemies.length;i++){
            if(this.Maze[x][y].Ennemies[i]!=undefined){
                this.Maze[x][y].Ennemies[i].activate()
            }
        }
    }
    RemoveEnnemy(x,y){
        for(var i = 0 ; i < this.Maze[x][y].Ennemies.length;i++){
            if(this.Maze[x][y].Ennemies[i]!=undefined){
                this.Maze[x][y].Ennemies[i].deactivate()
                for(var j = 0 ; j < this.Maze[x][y].Ennemies[i].projectiles.length;j++){
                    this.Maze[x][y].Ennemies[i].projectiles[j].destroy()
                }
                this.Maze[x][y].Ennemies[i].projectiles = []
            }
        }
    }
    hideMap() {
        this.mapGraphics.clear()
    }

    displayMap() {
        
        const tileSize = 40;
        const mapWidth = this.MazeWidth * tileSize;
        const mapHeight = this.MazeHeight * tileSize;

        if (this.mapGraphics) {
            this.mapGraphics.clear();
        } else {
            this.mapGraphics = this.add.graphics();
        }

        this.mapGraphics.fillStyle(0x000000, 1);
        this.mapGraphics.fillRect(
            (this.cameras.main.width - mapWidth) / 2,
            (this.cameras.main.height - mapHeight) / 2,
            mapWidth,
            mapHeight
        );

        for (let y = 0; y < this.MazeHeight; y++) {
            for (let x = 0; x < this.MazeWidth; x++) {
                if (this.Maze[y][x].visited === true && this.Maze[y][x].wall === false) {
                    this.mapGraphics.fillStyle(0xff0000, 1);
                } else if (this.Maze[y][x].discovered === true && this.Maze[y][x].wall === false) {
                    this.mapGraphics.fillStyle(0x880000, 1);
                } else {
                    this.mapGraphics.fillStyle(0x000000, 1);
                }
                const rectX = (this.cameras.main.width - mapWidth) / 2 + x * tileSize;
                const rectY = (this.cameras.main.height - mapHeight) / 2 + y * tileSize;
                this.mapGraphics.fillRect(rectX, rectY, tileSize, tileSize);
            }
        }
        this.mapGraphics.fillStyle(0x00ff00, 1);
        const rectX = (this.cameras.main.width - mapWidth) / 2 + this.player.MazeX * tileSize;
        const rectY = (this.cameras.main.height - mapHeight) / 2 + this.player.MazeY * tileSize;
        this.mapGraphics.fillRect(rectX, rectY, tileSize, tileSize);
    }       

    displayFullMap() {
        const tileSize = 40;
        const mapWidth = this.MazeWidth * tileSize;
        const mapHeight = this.MazeHeight * tileSize;

        if (this.mapGraphics) {
            this.mapGraphics.clear();
        } else {
            this.mapGraphics = this.add.graphics();
        }

        this.mapGraphics.fillStyle(0x000000, 0.75);
        this.mapGraphics.fillRect(
            (this.cameras.main.width - mapWidth) / 2,
            (this.cameras.main.height - mapHeight) / 2,
            mapWidth,
            mapHeight
        );

        for (let y = 0; y < this.MazeHeight; y++) {
            for (let x = 0; x < this.MazeWidth; x++) {
                if (this.player.Maze[y][x].wall === true) {
                    this.mapGraphics.fillStyle(0xff0000, 1); 
                } else if (this.Maze[y][x].special == "key"){
                    this.mapGraphics.fillStyle(0x808080, 1);
                }else if (this.Maze[y][x].special == "ice"){
                    this.mapGraphics.fillStyle(0x77b5fe, 1);
                }else if(this.Maze[y][x].special == "water"){
                    this.mapGraphics.fillStyle(0x0000ff, 1);
                    
                }else if(this.Maze[y][x].special == "wind"){
                    this.mapGraphics.fillStyle(0x006400, 1);
                }else {
                    this.mapGraphics.fillStyle(0x000000, 1);

                }
                const rectX = (this.cameras.main.width - mapWidth) / 2 + x * tileSize;
                const rectY = (this.cameras.main.height - mapHeight) / 2 + y * tileSize;
                this.mapGraphics.fillRect(rectX, rectY, tileSize, tileSize);
            }
        }
        this.mapGraphics.fillStyle(0x00ff00, 1); 
        const rectX = (this.cameras.main.width - mapWidth) / 2 + this.player.MazeX * tileSize;
        const rectY = (this.cameras.main.height - mapHeight) / 2 + this.player.MazeY * tileSize;
        this.mapGraphics.fillRect(rectX, rectY, tileSize, tileSize);
    }

    
}
