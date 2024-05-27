import Phaser, { Game } from 'phaser';
import { Scene } from "phaser";
import { Player } from "../GameObjects/playerBoss";
import { Ganon } from "../GameObjects/Ganon";
import { Ennemy } from "../GameObjects/ennemy";

export class BossScene extends Scene {

    constructor() {
        super('BossScene');
    }

    init(data) {
        let weapon = data.weapon
        let attackDamage = data.attack
        let health = data.health
        this.player = new Player({ scene: this , weapon: weapon, AttackDamage: attackDamage, Health: health}).setScale(0.75)
    }
    
    preload() {
        this.load.image("ganon1","./public/assets/Ganon/ganon1.png")
        this.load.image("ganon1CALL","./public/assets/Ganon/ganon1CALL.png")
        this.load.image("ganon1GROUND","./public/assets/Ganon/ganon1Ground.png")
        this.load.image("ganon1SHIELD","./public/assets/Ganon/ganon1SHIELD.png")
        this.load.image("ganon1START","./public/assets/Ganon/ganon1START.png")

        this.load.image("ganon2CALL","./public/assets/Ganon/ganon2CALL.png")
        this.load.image("ganon2GROUND","./public/assets/Ganon/ganon2Ground.png")

        this.load.image("GanonAzad","./public/assets/Ganon/GanonFinal.png")
        this.load.image("GanonAzadW","./public/assets/Ganon/GanonFinalW.png")

        this.load.image("bullet1","./public/assets/Ganon/Bullet/Bullet1.png")
        this.load.image("bullet2","./public/assets/Ganon/Bullet/Bullet2.png")
        this.load.image("bullet3","./public/assets/Ganon/Bullet/Bullet3.png")
        this.load.image("bullet4","./public/assets/Ganon/Bullet/Bullet4.png")
        this.load.image("bullet5","./public/assets/Ganon/Bullet/Bullet5.png")
        this.load.image("bullet6","./public/assets/Ganon/Bullet/Bullet6.png")
        this.load.image("bullet7","./public/assets/Ganon/Bullet/Bullet7.png")


    }
    create(){
        
        this.Ganon = new Ganon({ scene: this }).setScale(2);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.status = ""
        this.keys = this.input.keyboard.addKeys({
            'Z': Phaser.Input.Keyboard.KeyCodes.Z,
            'Q': Phaser.Input.Keyboard.KeyCodes.Q,
            'S': Phaser.Input.Keyboard.KeyCodes.S,
            'D': Phaser.Input.Keyboard.KeyCodes.D,
            'TAB' : Phaser.Input.Keyboard.KeyCodes.TAB
        });
        this.Ennemies = []
        this.input.on('pointerdown', (pointer) => {
            if (pointer.button === 0 && this.player.CanAttack) {
                this.player.CanAttack = false
                this.player.Attack(this.input.mousePointer.downX,this.input.mousePointer.downY,this.Ennemies,this.Ganon)
            } else if (pointer.button === 2) {
                if(this.player.CanDash == true){
                    this.player.CanDash = false
                    this.player.velocity = 30
                    setTimeout(() => {
                        this.player.velocity = 8
                        setTimeout(() => {
                            this.player.CanDash = true;
                        }, 500);
                    }, 100);
                }
            }
        });
        const style = { 
            fontFamily: '"BOTW"',
            fontSize: '32px',
            fill: '#f00'
        };

        const GameOver = this.add.text(960/2, 480, 'Ganon', style).setOrigin(0.5);
        this.input.mouse.disableContextMenu();
        this.player.UpdateHealth()
        this.Ganon.FirstPhase()

    }
    SpawnBokoblin(nb){
        for(var i = 0 ; i < nb;i++){
            var boko = new Ennemy({scene: this,type: "bokoblin"}).setScale(0.75)
            boko.Player = this.player
            boko.activate()
            this.Ennemies.push(boko)
        }

    }
    update(){
        if(this.Ganon.phase != 0){

        
        if(this.Ganon.phase != 2){
            if(this.Ganon.phase == 3){
                this.Ganon.MoveGanon(this.player)
            }
            for(var i = 0 ; i < this.Ennemies.length;i++){
                if(this.Ennemies[i] !== undefined){
                    this.Ennemies[i].update(this.player)
    
                }
            } 
            
            this.player.update();
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
        }else{
            this.Ganon.update(this.player);
        }
    }

    }


      
}