import { GameObjects,Physics } from "phaser";
import {GameOverScene} from "../scenes/gameoverscene"
import{BossScene} from "../scenes/BossScene"
import {global} from "../main"



export class Player extends Physics.Arcade.Sprite {

    velocity = 10;
    size = 50;
    MazeX = 0;
    MazeY = 0;
    MazeMaxX = 10;
    MazeMaxY = 10;
    HealthBar = []
    Direction = []
    heart = null
    key = null
    oldDirection = ""
    actualroom =""
    weapon = ""
    constructor({scene, weapon, attackBonus, heartBonus}) {

        super(scene, 200, 100, "player");
        this.CanDash = true
        this.CanAttack = true
        this.scene = scene;
        this.Maze = []
        this.weapon = weapon
        this.getkey = false
        switch(this.weapon){
            case "spear":
                this.AttackDamage = 10 * (0.4 * ((attackBonus))+1)
                break;
            case "sword":
                this.AttackDamage = 20 * (0.4 * ((attackBonus))+1)
        }
        this.Health = 10 + heartBonus*2
        this.MaxHealth = this.Health
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        
    }
    

    move(direction) {
        if(direction.length == 0){
            this.anims.stop();
        }
        for(var i = 0 ; i < direction.length;i++){
            switch (direction[i]) {
                case "up":
                    this.oldDirection = direction
                    if (this.y > 0 +this.size+30){
                        if(this.actualroom == "water"){
                            this.y -= this.velocity/2;
                        }else {
                            this.y -= this.velocity;
                        }
                        this.anims.play('walk-up', true);

                    }else {
                        this.SwitchRoom(direction[i])
                    }
                    break;
                case "down":
                    this.oldDirection = direction
                    if (this.y < 540 -this.size -30){
                        if(this.actualroom == "water"){
                            this.y += this.velocity/2;
                        }else {
                            this.y += this.velocity;
                        }
                        this.anims.play('walk-down', true);
                    }else {
                        this.SwitchRoom(direction[i])
                    }
                    break;
                case "left":
                    this.oldDirection = direction
                    if (this.x > 0 +this.size+30){
                        if(this.actualroom == "water"){
                            this.x -= this.velocity/2;
                        }else {
                            this.x -= this.velocity;
                        }
                        this.anims.play('walk-left', true);
                    }else {
                        this.SwitchRoom(direction[i])
                    }
                    break;      
                case "right":
                    this.oldDirection  = direction
                    if ( this.x < 960 -this.size-30){
                        if(this.actualroom == "water"){
                            this.x += this.velocity/2;
                        }else {
                            this.x += this.velocity;
                        }
                        this.anims.play('walk-right', true);
                    }else {
                        this.SwitchRoom(direction[i])
                        
                    }
                    break;
                default:
                    break;
            }
        }
        
        if(this.Maze[this.MazeY][this.MazeX].special == "ice"){
            if(direction.length == 0 ){
                this.move(this.oldDirection)
            }
        }else if (this.Maze[this.MazeY][this.MazeX].special == "wind"){
            switch(this.Maze[this.MazeY][this.MazeX].wind){
                case 1:
                    this.x +=1
                    break;
                case 2:
                    this.x -=1
                    break;
                case 3:
                    this.y -=1
                    break;
                case 0 :
                    this.y +=1
                    break;
            }

        }
        
        if(this.Maze[this.MazeY][this.MazeX].special == "key"){
            if(this.x > 960/2-40 && this.x < 960/2+40 && this.y > 540/2-40 && this.y < 540/2+40){
                this.key.destroy();
                this.getkey = true
            }
        } else if(this.Maze[this.MazeX][this.MazeY].heart === true){
            if(this.x > 960/2-40 && this.x < 960/2+40 && this.y > 540/2-40 && this.y < 540/2+40){
                this.heart.destroy();
                this.Maze[this.MazeX][this.MazeY].heart = false
                this.Health += 2
                if (this.Health > this.MaxHealth) {
                    this.Health = this.MaxHealth
                }
                this.UpdateHealth()
            }
        }
    }
    SwitchRoom(direction){
        if (this.key != null){
            this.key.destroy()
        }
        if (this.heart != null) {
            this.heart.destroy()
        }
        switch (direction) {
            case "up":
                if(this.MazeY != 0){
                    if(this.Maze[this.MazeY-1][this.MazeX].wall == false){
                        this.y = 540-this.size
                        this.scene.RemoveEnnemy(this.MazeX,this.MazeY)
                        this.MazeY--;
                        this.scene.displayEnnemy(this.MazeX,this.MazeY)
                        this.actualroom = this.Maze[this.MazeY][this.MazeX].special
                        for (let i=0; i<this.scene.walls.length; i++) {
                            this.scene.walls[i].destroy()
                        }
                        this.scene.walls = []
                        this.scene.checkWalls()
                        this.SpecialRoom()
                    }
                }
                break;
            case "down":
                if(this.MazeY != this.MazeMaxY-1){
                    if(this.Maze[this.MazeY+1][this.MazeX].wall == false){
                        this.y = 0+this.size
                        this.scene.RemoveEnnemy(this.MazeX,this.MazeY)

                        this.MazeY++;
                        this.scene.displayEnnemy(this.MazeX,this.MazeY)
                        this.actualroom = this.Maze[this.MazeY][this.MazeX].special
                        for (let i=0; i<this.scene.walls.length; i++) {
                            this.scene.walls[i].destroy()
                        }
                        this.scene.walls = []
                        this.scene.checkWalls()
                        this.SpecialRoom()

                    }

                }
                break;
            case "left":
                if(this.MazeX != 0){
                    if(this.Maze[this.MazeY][this.MazeX-1].wall == false){
                        this.x = 960-this.size
                        this.scene.RemoveEnnemy(this.MazeX,this.MazeY)
                        this.MazeX--;
                        this.scene.displayEnnemy(this.MazeX,this.MazeY)
                        this.actualroom = this.Maze[this.MazeY][this.MazeX].special
                        for (let i=0; i<this.scene.walls.length; i++) {
                            this.scene.walls[i].destroy()
                        }
                        this.scene.walls = []
                        this.scene.checkWalls()
                        this.SpecialRoom()
                    }
                }
                break;
            case "right":
                if(this.MazeX == 9 && this.MazeY == 9 && this.getkey){
                    this.scene.scene.start("BossScene", {weapon: this.weapon, attack: this.AttackDamage, health: this.MaxHealth})
                }else if(this.MazeX != this.MazeMaxX-1){
                    if(this.Maze[this.MazeY][this.MazeX+1].wall == false){
                        this.x = 0+this.size
                        this.scene.RemoveEnnemy(this.MazeX,this.MazeY)
                        this.MazeX++;
                        this.scene.displayEnnemy(this.MazeX,this.MazeY)
                        this.actualroom = this.Maze[this.MazeY][this.MazeX].special
                        for (let i=0; i<this.scene.walls.length; i++) {
                            this.scene.walls[i].destroy()
                        }
                        this.scene.walls = []
                        this.scene.checkWalls()
                        this.SpecialRoom()
                    }
                }
                break;
            default:
                break;
        }

    }
    SpecialRoom(){
        if (this.Maze[this.MazeX][this.MazeY].heart == true) {
            this.heart = this.scene.add.image(960/2, 540/2, "FullHeart").setOrigin(0.5, 0.5).setScale(0.2)  
        }
        switch(this.Maze[this.MazeY][this.MazeX].special){
            case "key":
                this.key = this.scene.add.image(960/2, 540/2, "key").setOrigin(0.5, 0.5).setScale(0.08) 
                this.scene.setBackground("BG")                
                break
            case "water":
                this.scene.setBackground("waterBG")  
                break
            case "ice":
                this.scene.setBackground("iceBG") 
                break
            default:
                this.scene.setBackground("BG") 
                break
        }
    }


    Attack(mouseX,mouseY,ennemies){
        switch (this.weapon) {
            case "sword":
                this.AttackSword(mouseX,mouseY,ennemies)
                break;
            case "spear":
                this.AttackSpear(mouseX,mouseY,ennemies)
                break;
        }
    }
    AttackSpear(mouseX,mouseY,ennemy){
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
                        this.scene.DisplayRubis()
                        this.scene.Maze[this.MazeX][this.MazeY].Ennemies[i].deactivate()
                        delete this.scene.Maze[this.MazeX][this.MazeY].Ennemies[i]
                        this.scene.Maze[this.MazeX][this.MazeY].checkEnnemies()
                        this.SpecialRoom()
                    }
                }
            }
        }
        setTimeout(() => {
            graphics.destroy(); 
            
            setTimeout(() => {
                this.CanAttack = true;
            }, 200);
            
        }, 50);
    }
    AttackSword(mouseX,mouseY,ennemy) {
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
                    ennemy[i].IsAttacked(this.AttackDamage)
                    if(ennemy[i].Health <= 0){
                        switch(ennemy[i].type){
                            case "bokoblin":
                                global.coin += 3
                                break;
                            case "octorok":
                                global.coin += 1
                                break
                        }
                        this.scene.DisplayRubis()
                        this.scene.Maze[this.MazeX][this.MazeY].Ennemies[i].deactivate()
                        delete this.scene.Maze[this.MazeX][this.MazeY].Ennemies[i]
                        this.scene.Maze[this.MazeX][this.MazeY].checkEnnemies()
                        this.SpecialRoom()
                    }       
                }
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
}