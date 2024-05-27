import { GameObjects,Physics } from "phaser";


export class Ganon extends Physics.Arcade.Image {

    constructor({scene}) {
        super(scene, 480,100, "ganon1START");
        this.BasicVelocity = 2
        this.MaxHealth = 100
        this.Health = 100;
        this.scene = scene;
        this.projectiles = [];
        this.Bullet = null
        this.BulletGanon = true;
        this.BulletSpeed = 0;
        this.Bulletnb = 0;
        this.MeteorNB = 0;
        this.velocity = this.BasicVelocity
        this.active = true;
        this.CanAttack = true;
        this.phase = 1;
        this.Defense = 3;
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
                    this.Bullet.destroy();
                    if(this.Bulletnb >= 6){
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
    MoveGanon(Player){

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
        if(distance <= 200&& this.CanAttack){
            this.CanAttack = false
            this.AttackClaw(Player)
        }else if(distance >= 300 && this.CanAttack){
            const randAttack = Math.floor(Math.random() * 2)
            if(randAttack == 0){
                this.CanAttack = false
                this.MeteorNB = 0
                this.Defense = 10
                this.AttackMeteor(Player)
            }else {
                this.velocity = this.velocity*4
                this.CanAttack = false
                setTimeout(() => {
                    this.velocity = this.BasicVelocity
                    this.CanAttack = true
                }, 300);
            }

        }
    }
    Attacked(amount,Player){
        this.Health -= amount / this.Defense // /3
        console.log(amount / this.Defense)
        this.updateHealthBar()
        if(this.Health <= 0){
            this.Health = 0
            this.updateHealthBar()
            switch(this.phase){
                case 1:
                    this.invincibility = true
                    this.phase = 2
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
                    this.Health = 100
                    this.updateHealthBar()
                    this.phase = 3;
                    this.Defense = 5
                    Player.weapon = Player.selectedWeapon
                    this.setTexture("GanonAzad")
                    console.log("Phase 3 ou quoi la")
                    setTimeout(() => {
                        this.invincibility = false
                        
                        // this.SecondPhase()
                    }, 2000);
                    break;
                case 3:
                    this.scene.scene.start("menu")
                    break;
            }
        }
    }
    AttackClaw(Player){
        this.CanAttack = false
        const attackRadius = 150 // Radius of the attack arc
        const angleToMouse = Phaser.Math.Angle.Between(this.x, this.y, Player.x, Player.y)
        const halfArcAngle = Phaser.Math.DegToRad(45) // Half the angle of the quarter circle (45 degrees)
        
        const graphics = this.scene.add.graphics()
        graphics.lineStyle(10, 0xffa500)
        graphics.beginPath()
        graphics.arc(this.x, this.y, attackRadius, angleToMouse - halfArcAngle, angleToMouse + halfArcAngle, false)
        graphics.strokePath()
        this.velocity = 0
        setTimeout(() => {
            graphics.clear()

            graphics.lineStyle(10, 0xff0000)
            graphics.beginPath()
            graphics.arc(this.x, this.y, attackRadius, angleToMouse - halfArcAngle, angleToMouse + halfArcAngle, false)
            graphics.strokePath()
            const distanceToEnemy = Phaser.Math.Distance.Between(this.x, this.y, Player.x, Player.y)
            const angleToEnemy = Phaser.Math.Angle.Between(this.x, this.y, Player.x, Player.y)
            const isWithinArc = Phaser.Math.Angle.ShortestBetween(angleToMouse, angleToEnemy) <= halfArcAngle
            if (distanceToEnemy <= attackRadius+20 && isWithinArc) {
                Player.GetAttacked(3)
                // Player.IsAttacked(2);
            }
            setTimeout(() => {
                graphics.destroy()
                this.velocity = this.BasicVelocity
                setTimeout(() => {
                    this.CanAttack = true
                    
                }, 700);
            }, 100);
        },400)
    }
    AttackMeteor(Player){
        this.MeteorNB++
        const FireRadius = 100
        const graphics = this.scene.add.graphics()
        let FireX = Player.x
        let FireY = Player.y
        this.velocity = 0
        graphics.lineStyle(1, 0xffa500)
        graphics.fillStyle(0xffa500);
        graphics.alpha = 0.5;
        graphics.beginPath()
        graphics.arc(FireX, FireY, FireRadius, 0, 2 * Math.PI, false);
        graphics.closePath()
        graphics.strokePath()
        graphics.fill()
        
        setTimeout(() => {
            graphics.clear()


            graphics.lineStyle(1, 0xff0000)
            graphics.fillStyle(0xff0000);
            graphics.beginPath()
            graphics.arc(FireX, FireY, FireRadius, 0, 2 * Math.PI, false);
            graphics.closePath()
            graphics.strokePath()
            graphics.fill()
            const distance = Phaser.Math.Distance.Between(Player.x, Player.y, FireX, FireY);
            if(distance  <= FireRadius){
                Player.GetAttacked(1)
            }
            setTimeout(() => {
                graphics.destroy()
                this.velocity = this.BasicVelocity
                if(this.MeteorNB <= 5){
                    this.AttackMeteor(Player)
                }else {
                    setTimeout(() => {
                        this.CanAttack = true
                        this.Defense = 5;
                    }, 700);
                }
     
            }, 200);
        }, 500);
    }
}