import { GameObjects,Physics } from "phaser";

export class Ennemy extends Physics.Arcade.Image {

    constructor({scene}) {
        super(scene, 600, 300, "bokoblin");
        this.scene = scene;
        this.Maze = []
        this.Health = 100;
        this.BasicVelocity = 1;
        this.velocity = this.BasicVelocity
  
        this.CanAttack = true;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this)
        this.healthBar = this.scene.add.graphics()
        this.updateHealthBar()
    }   
    updateHealthBar() {
        this.healthBar.clear()
        this.healthBar.fillStyle(0xff0000, 1)
        this.healthBar.fillRect(this.x - 55, this.y - 60, this.Health, 8)
    }
    update(){
        this.updateHealthBar()
    }

    IsAttacked(amount) {
        // Logic for when the enemy is attacked
        this.Health-= amount;
        console.log("ouch il lui reste "+this.Health)
        if (this.Health <=0){
            this.destroy();
            // this.disableBody(true,true)
        }
    }
    Move(Player){
        if(Player.x < this.x){
            this.x = this.x-this.velocity
        }else if(Player.x > this.x) {
            this.x = this.x+this.velocity
        }
       
        if(Player.y < this.y){
            this.y = this.y-this.velocity
        }else if(Player.y > this.y) {
            this.y = this.y+this.velocity   
        }
        
        let distance = Math.sqrt(((Player.x-this.x)**2)+((Player.y-this.y)**2))
        if(distance <= 200){
            
            if(this.CanAttack){
                console.log("attaque !")    
                this.Attack(Player)
            }

        }

    }
    Attack(Player){
        
        let Attacked = false
        this.CanAttack = false
        const attackWidth = 100
        const attackHeight = 200
        const angleToPlayer = Phaser.Math.Angle.Between(this.x, this.y, Player.x, Player.y)
        
        const graphics = this.scene.add.graphics()
        graphics.fillStyle(0xffa500, 1)
    
        // Draw the rectangle
        graphics.save()
        graphics.translateCanvas(this.x, this.y)
        graphics.rotateCanvas(angleToPlayer)
        graphics.fillRect(0, -attackWidth / 2, attackHeight, attackWidth)
        // graphics.restoreCanvas()
    
        // Create a temporary attack zone for collision detection
        const attackZone = this.scene.add.rectangle(this.x, this.y, attackHeight, attackWidth)
        this.scene.physics.world.enable(attackZone)
        attackZone.setOrigin(0.5, 0.5)
        attackZone.setAngle(Phaser.Math.RadToDeg(angleToPlayer))
        attackZone.body.setOffset(-attackHeight / 2, -attackWidth / 2)
        this.velocity = 0
        setTimeout(() => {
            graphics.clear()
            
            graphics.fillStyle(0xff0000, 1)
            graphics.save()
            graphics.translateCanvas(this.x, this.y)
            graphics.rotateCanvas(angleToPlayer)
            graphics.fillRect(0, -attackWidth / 2, attackHeight, attackWidth)
            this.scene.physics.add.overlap(attackZone, Player, () => {
                console.log("touché ! ")
                if(!Attacked){
                    Player.GetAttacked(1)
                    Attacked = true
                }

                
            })

            setTimeout(() => {
                graphics.destroy()
                attackZone.destroy()
                this.velocity = this.BasicVelocity
                setTimeout(() => {
                    this.CanAttack = true
                    
                }, 700);
            }, 100);

        }, 200);
    }

}