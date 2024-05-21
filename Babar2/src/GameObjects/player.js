import { GameObjects,Physics } from "phaser";

export class Player extends Physics.Arcade.Sprite {
    CanDash = true
    CanAttack = true
    velocity = 5;
    size = 50;
    MazeX = 0;
    MazeY = 0;
    MazeMaxX = 10;
    MazeMaxY = 10;
    HealthBar = []
    Direction = []
    constructor({scene}) {
        super(scene, 200, 100, "player");
        this.scene = scene;
        this.Maze = []
        this.bokoblin = null
        this.weapon = "spear"
        switch(this.weapon){
            case "spear":
                this.AttackDamage = 10
                break;
            case "sword":
                this.AttackDamage = 20
        }
        this.Health = 10//10 demi coeurs pour 5 coeurs
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
    }
    

    move(direction) {
        for(var i = 0 ; i < direction.length;i++){
            switch (direction[i]) {
                case "up":
                    if (this.y > 0 +this.size){
                        this.y -= this.velocity;
                    }else {
                        this.SwitchRoom(direction[i])
                    }
                    break;
                case "down":
                    if (this.y < 540 -this.size){
                        this.y += this.velocity;
                    }else {
                        this.SwitchRoom(direction[i])
                    }
                    break;
                case "left":
                    if (this.x > 0 +this.size){
                        this.x-=this.velocity
                    }else {
                        this.SwitchRoom(direction[i])
                    }
                    break;
                case "right":
                    if ( this.x < 960 -this.size){
                        this.x+=this.velocity
                    }else {
                        this.SwitchRoom(direction[i])
                    }
                    break;
                default:
                    break;
            }
        }
    }
    SwitchRoom(direction){
        switch (direction) {
            case "up":
                if(this.MazeY != 0){
                    if(this.Maze[this.MazeY-1][this.MazeX] == 0){
                        this.y = 540-this.size
                        this.MazeY--;
                    }
                }
                break;
            case "down":
                if(this.MazeY != this.MazeMaxY-1){
                    if(this.Maze[this.MazeY+1][this.MazeX] == 0){
                        this.y = 0+this.size
                        this.MazeY++;
                    }

                }
                break;
            case "left":
                if(this.MazeX != 0){
                    if(this.Maze[this.MazeY][this.MazeX-1] == 0){
                        this.x = 960-this.size
                        this.MazeX--;
                    }
                }
                break;
            case "right":
                if(this.MazeX != this.MazeMaxX-1){
                    if(this.Maze[this.MazeY][this.MazeX+1] == 0){

                        this.x = 0+this.size
                        this.MazeX++;
                    }
                }
                break;
            default:
                break;
        }
    }
    Attack(mouseX,mouseY,bokoblin){
        switch (this.weapon) {
            case "sword":
                this.AttackSword(mouseX,mouseY,bokoblin)
                break;
            case "spear":
                this.AttackSpear(mouseX,mouseY,bokoblin)
                break;

            default:
                break;
        }
    }
    AttackSpear(mouseX,mouseY,bokoblin){
        const attackWidth = 35
        const attackHeight = 250
        const angleToPlayer = Phaser.Math.Angle.Between(this.x, this.y, mouseX, mouseY)
                
        const graphics = this.scene.add.graphics()
        graphics.fillStyle(0xff0000, 0.5)
        graphics.save()
        graphics.translateCanvas(this.x, this.y)
        graphics.rotateCanvas(angleToPlayer)
        graphics.fillRect(0, -attackWidth / 2, attackHeight, attackWidth)

        const distanceToEnemy = Phaser.Math.Distance.Between(this.x, this.y, bokoblin.x, bokoblin.y);
        const angleToEnemy = Phaser.Math.Angle.Between(this.x, this.y, bokoblin.x, bokoblin.y);
        const angleDifference = Phaser.Math.Angle.Wrap(angleToEnemy - angleToPlayer);
    
        // Vérifier si l'ennemi est dans la zone d'attaque
        const isWithinDistance = distanceToEnemy <= attackHeight;
        const isWithinWidth = Math.abs(distanceToEnemy * Math.sin(angleDifference)) <= attackWidth+30 / 2;
        const isWithinArc = Math.abs(angleDifference) <= Phaser.Math.DegToRad(45); // 45 degrees arc
    
        if (isWithinDistance && isWithinWidth && isWithinArc) {
            console.log("aaaaah");
            bokoblin.IsAttacked(this.AttackDamage);
        }
        setTimeout(() => {
            graphics.destroy(); 
            
            setTimeout(() => {
                this.CanAttack = true;
            }, 200);
            
        }, 50);
    }

    // this.scene.physics.add.overlap(attackZone, bokoblin, () => {
    //     console.log("aaaaah")
    //     bokoblin.IsAttacked(this.AttackDamage) 
    // })
    AttackSword(mouseX,mouseY,bokoblin) {
        const attackRadius = 175 // Radius of the attack arc
        const angleToMouse = Phaser.Math.Angle.Between(this.x, this.y, mouseX, mouseY)
        const halfArcAngle = Phaser.Math.DegToRad(30) // Half the angle of the quarter circle (45 degrees)
        
        const graphics = this.scene.add.graphics()
        graphics.lineStyle(2, 0xff0000)
        graphics.beginPath()
        graphics.arc(this.x, this.y, attackRadius, angleToMouse - halfArcAngle, angleToMouse + halfArcAngle, false)
        graphics.strokePath()

        const distanceToEnemy = Phaser.Math.Distance.Between(this.x, this.y, bokoblin.x, bokoblin.y)
        const angleToEnemy = Phaser.Math.Angle.Between(this.x, this.y, bokoblin.x, bokoblin.y)
        const isWithinArc = Phaser.Math.Angle.ShortestBetween(angleToMouse, angleToEnemy) <= halfArcAngle
    
        if (distanceToEnemy <= attackRadius+20 && isWithinArc) {
            bokoblin.IsAttacked(this.AttackDamage)
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
    }
    UpdateHealth(){
        for(var i = 0 ; i < this.HealthBar.length ; i++){
            this.HealthBar[i].destroy()
        }
        this.HealthBar= []
        var life = this.Health;
        for(var i = 0 ; i < 5 ; i++){
            if(life >= 2){
                var Heart = this.scene.add.image(0+55*i,2,"FullHeart").setOrigin(0, 0).setScale(0.20)
                this.HealthBar.push(Heart)
                life -=2
            }else if(life == 1){
                var Heart =this.scene.add.image(0+55*i,2,"MidHeart").setOrigin(0, 0).setScale(0.20)
                this.HealthBar.push(Heart)
                life-=1
            }else {
                var Heart =this.scene.add.image(0+55*i,2,"EmptyHeart").setOrigin(0, 0).setScale(0.20)
                this.HealthBar.push(Heart)
            }
        }
    }
}