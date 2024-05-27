import { GameObjects,Physics } from "phaser";
import {GameOverScene} from "../scenes/gameoverscene"
import {global} from "../main"

export class Player extends Physics.Arcade.Sprite {

    velocity = 8;
    size = 50;
    HealthBar = []
    Direction = []




    constructor({scene, weapon, AttackDamage, Health}) {

        super(scene, 960/2, 400, "player");
        this.CanDash = true
        this.CanAttack = true
        this.scene = scene;
        this.Maze = []
    
        this.bokoblin = null
        this.weapon = weapon
        this.selectedWeapon = weapon
        this.AttackDamage = AttackDamage
        this.Health = Health
        this.MaxHealth = Health
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
    }

    move(direction) {

        for(var i = 0 ; i < direction.length;i++){
            switch (direction[i]) {
                
                case "up":
                    this.oldDirection = direction
                    if (this.y > 0 +this.size){
                        this.y -= this.velocity;
                    }
                    break;
                case "down":
                    this.oldDirection = direction
                    if (this.y < 540 -this.size){
                        this.y += this.velocity;
                    }
                    break;
                case "left":
                    this.oldDirection = direction
                    if (this.x > 0 +this.size){
                        this.x -= this.velocity/2;
                    }
                    break;
                case "right":
                    this.oldDirection  = direction
                    if ( this.x < 960 -this.size){
                        this.x += this.velocity/2;
                    }
                    break;
                default:
                    break;
            }
        }
        
    }
    Attack(mouseX,mouseY,ennemies,Ganon){
        switch (this.weapon) {
            case "sword":
                this.AttackSword(mouseX,mouseY,ennemies,Ganon)
                break;
            case "spear":
                this.AttackSpear(mouseX,mouseY,ennemies,Ganon)
                break;
            case "master":
                this.AttackMaster(mouseX,mouseY,Ganon)
                break;
        }
    }
    AttackMaster(mouseX,mouseY,Ganon){
        const attackRadius = 100
        const angleToMouse = Phaser.Math.Angle.Between(this.x, this.y, mouseX, mouseY)
        const halfArcAngle = Phaser.Math.DegToRad(30) 
        
        const graphics = this.scene.add.graphics()
        graphics.lineStyle(2, 0xff0000)
        graphics.beginPath()
        graphics.arc(this.x, this.y, attackRadius, angleToMouse - halfArcAngle, angleToMouse + halfArcAngle, false)
        graphics.strokePath()
        if(Ganon.Bullet != null){
            const distanceToEnemy = Phaser.Math.Distance.Between(this.x, this.y, Ganon.Bullet.x, Ganon.Bullet.y)
            const angleToEnemy = Phaser.Math.Angle.Between(this.x, this.y, Ganon.Bullet.x, Ganon.Bullet.y)
            const isWithinArc = Phaser.Math.Angle.ShortestBetween(angleToMouse, angleToEnemy) <= halfArcAngle 
            if (distanceToEnemy <= attackRadius+20 && isWithinArc) {
                Ganon.ReturnBullet(Ganon.BulletSpeed+75)
            }
        }
        if(!Ganon.invincibility){
            const distanceToEnemy = Phaser.Math.Distance.Between(this.x, this.y, Ganon.x, Ganon.y)
            const angleToEnemy = Phaser.Math.Angle.Between(this.x, this.y, Ganon.x, Ganon.y)
            const isWithinArc = Phaser.Math.Angle.ShortestBetween(angleToMouse, angleToEnemy) <= halfArcAngle 
            if (distanceToEnemy <= attackRadius+20 && isWithinArc) {
                Ganon.Attacked(this.AttackDamage,this)
            }
        }
        setTimeout(() => {
            graphics.destroy(); 
            setTimeout(() => {
                this.CanAttack = true;
            }, 350);
        }, 50);
    }


    AttackSpear(mouseX,mouseY,ennemy,Ganon){
        const attackWidth = 35
        const attackHeight = 250
        const angleToPlayer = Phaser.Math.Angle.Between(this.x, this.y, mouseX, mouseY)
                
        const graphics = this.scene.add.graphics()
        graphics.fillStyle(0xff0000, 0.5)
        graphics.save()
        graphics.translateCanvas(this.x, this.y)
        graphics.rotateCanvas(angleToPlayer)
        graphics.fillRect(0, -attackWidth / 2, attackHeight, attackWidth)
        for(var i = 0 ; i < ennemy.length;i++){
            if(ennemy[i]!= undefined){
                const distanceToEnemy = Phaser.Math.Distance.Between(this.x, this.y, ennemy[i].x, ennemy[i].y);
                const angleToEnemy = Phaser.Math.Angle.Between(this.x, this.y, ennemy[i].x, ennemy[i].y);
                const angleDifference = Phaser.Math.Angle.Wrap(angleToEnemy - angleToPlayer);
                const isWithinDistance = distanceToEnemy <= attackHeight;
                const isWithinWidth = Math.abs(distanceToEnemy * Math.sin(angleDifference)) <= attackWidth+30 / 2;
                const isWithinArc = Math.abs(angleDifference) <= Phaser.Math.DegToRad(45);
                if (isWithinDistance && isWithinWidth && isWithinArc) {
                    ennemy[i].IsAttacked(this.AttackDamage);
                    if(ennemy[i].Health <= 0){
                        switch(ennemy[i].type){
                            case "bokoblin":
                                global.coin += 3
                                break
                            case "octorok":
                                global.coin += 1
                                break
                        }
                        ennemy[i].deactivate()
                        delete ennemy[i]
                        if(this.checkEnnemies(ennemy)){
                            Ganon.DestroyShield()
                        }
                    }
                }
            }
        }
        if(!Ganon.invincibility){
            const distanceToEnemy = Phaser.Math.Distance.Between(this.x, this.y, Ganon.x, Ganon.y);
            const angleToEnemy = Phaser.Math.Angle.Between(this.x, this.y, Ganon.x, Ganon.y);
            const angleDifference = Phaser.Math.Angle.Wrap(angleToEnemy - angleToPlayer);
            const isWithinDistance = distanceToEnemy-20 <= attackHeight;
            const isWithinWidth = Math.abs(distanceToEnemy * Math.sin(angleDifference)) <= attackWidth+30 / 2;
            const isWithinArc = Math.abs(angleDifference) <= Phaser.Math.DegToRad(45);
            if (isWithinDistance && isWithinWidth && isWithinArc) {
                Ganon.Attacked(this.AttackDamage,this)
            }
        }

        setTimeout(() => {
            graphics.destroy(); 
            
            setTimeout(() => {
                this.CanAttack = true;
            }, 200);
            
        }, 50);
    }
    
    AttackSword(mouseX,mouseY,ennemy,Ganon) {
        const attackRadius = 175 
        const angleToMouse = Phaser.Math.Angle.Between(this.x, this.y, mouseX, mouseY)
        const halfArcAngle = Phaser.Math.DegToRad(30) 
        
        const graphics = this.scene.add.graphics()
        graphics.lineStyle(2, 0xff0000)
        graphics.beginPath()
        graphics.arc(this.x, this.y, attackRadius, angleToMouse - halfArcAngle, angleToMouse + halfArcAngle, false)
        graphics.strokePath()
        for(var i = 0 ; i < ennemy.length;i++){
            if(ennemy[i]!= undefined){
                const distanceToEnemy = Phaser.Math.Distance.Between(this.x, this.y, ennemy[i].x, ennemy[i].y)
                const angleToEnemy = Phaser.Math.Angle.Between(this.x, this.y, ennemy[i].x, ennemy[i].y)
                const isWithinArc = Phaser.Math.Angle.ShortestBetween(angleToMouse, angleToEnemy) <= halfArcAngle
                if (distanceToEnemy <= attackRadius+20 && isWithinArc) {
                    ennemy[i].IsAttacked(this.AttackDamage);
                    if(ennemy[i].Health <= 0){
                        switch(ennemy[i].type){
                            case "bokoblin":
                                global.coin += 3
                                break
                            case "octorok":
                                global.coin += 1
                                break
                        }
                        ennemy[i].deactivate()
                        delete ennemy[i]
                        if(this.checkEnnemies(ennemy)){
                            Ganon.DestroyShield()
                        }
                    }  
                      
                }
            }
        }
        if(!Ganon.invincibility){
            const distanceToEnemy = Phaser.Math.Distance.Between(this.x, this.y, Ganon.x, Ganon.y)
            const angleToEnemy = Phaser.Math.Angle.Between(this.x, this.y, Ganon.x, Ganon.y)
            const isWithinArc = Phaser.Math.Angle.ShortestBetween(angleToMouse, angleToEnemy) <= halfArcAngle 
            if (distanceToEnemy <= attackRadius+20 && isWithinArc) {
                Ganon.Attacked(this.AttackDamage,this)
            }
        }
        setTimeout(() => {
            graphics.destroy(); 
            setTimeout(() => {
                this.CanAttack = true;
            }, 350);
        }, 50);
    }

    isEnemyInCone(enemy, startX, startY, angle, coneWidth, coneLength) {
        const enemyX = enemy.x;
        const enemyY = enemy.y;

        const distance = Phaser.Math.Distance.Between(startX, startY, enemyX, enemyY);
        if (distance > coneLength) return false;

        const enemyAngle = Phaser.Math.Angle.Between(startX, startY, enemyX, enemyY);
        const diffAngle = Phaser.Math.Angle.Wrap(enemyAngle - angle);

        return Math.abs(diffAngle) <= coneWidth;
    }
    GetAttacked(amount){
        this.Health = this.Health - amount
        this.UpdateHealth()
        if(this.Health <= 0){
            this.scene.scene.start("gameover")
        }

    }
    UpdateHealth(){
        for(var i = 0 ; i < this.HealthBar.length ; i++){
            this.HealthBar[i].destroy()
        }
        this.HealthBar= []
        var life = this.Health
        for(var i = 0 ; i < this.MaxHealth ; i+=2){
            if(life >= 2){
                var Heart = this.scene.add.image(0+23*i,2,"FullHeart").setOrigin(0, 0).setScale(0.20)
                Heart.setDepth(1000);
                this.HealthBar.push(Heart)
                
                life -=2
            }else if(life == 1){
                var Heart =this.scene.add.image(0+23*i,2,"MidHeart").setOrigin(0, 0).setScale(0.20)
                Heart.setDepth(1000);
                this.HealthBar.push(Heart)
                life--
            }else {
                var Heart =this.scene.add.image(0+23*i,2,"EmptyHeart").setOrigin(0, 0).setScale(0.20)
                Heart.setDepth(1000);
                this.HealthBar.push(Heart)
            }
        }
    }
    checkEnnemies(Ennemies) {
        if (Ennemies.length == 0) {
            return false
        }
        for (let i = 0; i < Ennemies.length; i++ ) {
            if ((Ennemies[i] != undefined) &&(Ennemies[i] != null)){
                return false
            }
        }
        return true
    }
}