import { GameObjects,Physics } from "phaser";


export class Ganon extends Physics.Arcade.Image {

    constructor({scene}) {
        super(scene, 480,100, "ganon1START");
        this.BasicVelocity = 0
        this.MaxHealth = 100
        this.Health = 100;
        this.projectiles = [];
        this.Bullet = null
        this.BulletGanon = true;
        this.BulletSpeed = 0;
        this.Bulletnb = 0;

        this.velocity = this.BasicVelocity
        this.active = true;
        this.CanAttack = true;
        this.phase = 1;
        
        this.invincibility = true
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this)
        this.healthBar = this.scene.add.graphics()
        this.updateHealthBar()
        
    } 

    update(Player){
        if(this.Bullet != null){
            if (this.BulletGanon){
                const distance = Phaser.Math.Distance.Between(this.Bullet.x, this.Bullet.y, 480, 400);
                if (distance < 40) {
                    this.Bullet.destroy();
                    this.BulletGanon = false
                    Player.GetAttacked(2)
                    this.Bulletnb = 0
                    setTimeout(() => {
                        this.SecondPhase()
                    }, 2000);
                }
            }else {
                const distance = Phaser.Math.Distance.Between(this.Bullet.x, this.Bullet.y, this.x, this.y);
                if (distance < 40) {
                    console.log("Bullet on ganon")
                    this.Bullet.destroy();
                    if(this.Bulletnb >= 6){
                        console.log("ouch")
                        this.Bulletnb = 0;
                        this.Bullet = null
                        this.BulletGanon = true
                        this.setTexture("ganon2GROUND")
                        this.Attacked(75,Player)
                        setTimeout(() => {
                            this.SecondPhase()
                        }, 2000);
                    }else {
                        console.log("Ganon return")
                        this.BulletGanon = true
                        this.BulletSpeed +=75
                        
                        this.LaunchBullet(this.BulletSpeed)
                    }

                }
            }

        }

    }
    updateHealthBar() {
        this.healthBar.clear()
        if(this.active){
            this.healthBar.fillStyle(0xff0000, 1)
            this.healthBar.fillRect(480-155, 500, this.Health*3, 20)       
        }
    }

    FirstPhase(){
        if(this.phase == 1){
            this.setTexture("ganon1CALL")
            setTimeout(() => {
                this.setTexture("ganon1SHIELD")
                if(this.Health < 50){
                    this.scene.SpawnBokoblin(3)
    
                }else {
                    this.scene.SpawnBokoblin(2)
                }
                
            }, 3000);
        }

    }

    SecondPhase(){
        if(this.phase == 2){
            this.BulletSpeed = 250
            this.setTexture("ganon2CALL")
            this.LaunchBullet(this.BulletSpeed)
        }
    }

    LaunchBullet(speedbullet){
        this.BulletGanon = true
        this.Bulletnb++
        const angleToPlayer = Phaser.Math.Angle.Between(this.x, this.y, 480, 400)
        const sprite = "bullet"+(this.Bulletnb)
        console.log(sprite)
        const projectile = this.scene.physics.add.sprite(this.x, this.y, sprite).setScale(0.3);
        projectile.displayWidth = 80;
        projectile.displayHeight = 80;
        projectile.setAngle(Phaser.Math.RadToDeg(angleToPlayer));
        const speed = speedbullet;
        this.Bullet = projectile
        projectile.setVelocity(
            Math.cos(angleToPlayer) * speed,
            Math.sin(angleToPlayer) * speed
        );

    }
    ReturnBullet(speedbullet){
        this.Bullet.destroy()
        this.BulletSpeed = speedbullet;
        this.BulletGanon = false;
        this.Bulletnb++
        
        console.log("return bullet : ",this.Bulletnb)
        const angleToPlayer = Phaser.Math.Angle.Between(480, 400, this.x, this.y)
        const sprite = "bullet"+(this.Bulletnb)
        console.log(sprite)

        const projectile = this.scene.physics.add.sprite(480, 400, sprite).setScale(0.3);
        projectile.displayWidth = 80;
        projectile.displayHeight = 80;
        projectile.setAngle(Phaser.Math.RadToDeg(angleToPlayer));
        const speed = speedbullet;
        this.Bullet = projectile
        projectile.setVelocity(
            Math.cos(angleToPlayer) * speed,
            Math.sin(angleToPlayer) * speed
        );
    }
    DestroyShield(){
        console.log("ouch")
        this.invincibility = false
        this.setTexture("ganon1")
        setTimeout(() => {
            this.invincibility = true;
            this.FirstPhase()
            
        }, 3000);
    }
    Attacked(amount,Player){
        this.Health -= amount /3 // /3
        this.updateHealthBar()
        if(this.Health <= 0){
            this.Health = 0
            this.updateHealthBar()
            switch(this.phase){
                case 1:
                    this.invincibility = true
                    this.phase = 2
                    console.log("Phase 2 ou quoi la")
                    //transition
                    Player.x = 480
                    Player.y = 400
                    this.setTexture("ganon1GROUND")

                    setTimeout(() => {
                        this.Health = 100
                        this.updateHealthBar()
                        Player.weapon = "master"
                        this.SecondPhase()
                    }, 2000);
                    break;
                case 2:
                    this.phase = 3;
                    console.log("Phase 3 ou quoi la")
                    setTimeout(() => {
                        this.Health = 100
                        this.updateHealthBar()
                        Player.weapon = "spear"
                        // this.SecondPhase()
                    }, 2000);
                    break;
            }
        }
    }
}