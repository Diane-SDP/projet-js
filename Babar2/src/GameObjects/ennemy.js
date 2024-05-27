import { GameObjects,Physics } from "phaser";

export class Ennemy extends Physics.Arcade.Image {

    constructor({scene,type}) {
        
        switch(type){
            case "bokoblin":
                var image = "bokoblin"
                var velocity = 1
                break;
            case "octorok":
                var image = "octorok"
                var velocity = 2
        }
        super(scene, Math.floor(Math.random() * 890)+30, Math.floor(Math.random() * 460)+30, image);
        this.BasicVelocity = velocity
        this.type = type
        this.scene = scene;
        this.Maze = []
        
        this.Health = 100;
        this.projectiles = [];
        this.velocity = this.BasicVelocity
        this.active = true;
        this.CanAttack = true;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this)
        this.healthBar = this.scene.add.graphics()
        this.deactivate()
        this.updateHealthBar()
        
    }   
    updateHealthBar() {
        this.healthBar.clear()
        if(this.active){
            this.healthBar.fillStyle(0xff0000, 1)
            this.healthBar.fillRect(this.x - 55, this.y - 60, this.Health, 8)       
        }

    }
    update(Player){
        this.updateHealthBar()
        this.Move(this.Player)
        this.projectiles.forEach((projectile, index) => {
            const distance = Phaser.Math.Distance.Between(projectile.x, projectile.y, Player.x, Player.y);
            if (distance < 40) {
                Player.GetAttacked(1)
                projectile.destroy();
                this.projectiles.splice(index, 1);
            }
        });
    }
    activate() {
        this.active = true;
        this.setVisible(true);
        this.setActive(true);
        this.body.enable = true;
    }

    deactivate() {
        this.healthBar.clear()
        this.active = false;
        this.setVisible(false);
        this.setActive(false);
        this.body.enable = false;
    }
    IsAttacked(amount) {
        this.Health-= amount;
    }
    Move(Player){
        switch(this.type){
            case "bokoblin":
                this.MoveBokoblin(Player)
                break;
            case "octorok":
                this.MoveOctorok(Player)
                break;
        }

    }
    MoveBokoblin(Player){
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
                this.AttackBokoblin(Player)
            }

        }
    }
    MoveOctorok(Player){
        let distance = Math.sqrt(((Player.x-this.x)**2)+((Player.y-this.y)**2))
        if(distance >= 300){
            
            if(this.CanAttack){
                this.AttackOctorok(Player)
            }

        } else {
            let directionX = this.x - Player.x;
            let directionY = this.y - Player.y;
            
            let magnitude = Math.sqrt(directionX ** 2 + directionY ** 2);
            directionX /= magnitude;
            directionY /= magnitude;
            
            let newX = this.x + directionX * this.velocity;
            let newY = this.y + directionY * this.velocity;
    
            if (newX < 0+80) newX = 0+80;
            if (newX > 960-80) newX = 960-80;
            if (newY < 0+80) newY = 0+80;
            if (newY > 540-80) newY = 540-80;
    
            this.x = newX;
            this.y = newY;
        }
    }

    AttackOctorok(Player){
        this.CanAttack = false
        const angleToPlayer = Phaser.Math.Angle.Between(this.x, this.y, Player.x, Player.y)
        const projectile = this.scene.physics.add.sprite(this.x, this.y, 'rock').setScale(0.3);
        projectile.displayWidth = 80;
        projectile.displayHeight = 80;
        projectile.setAngle(Phaser.Math.RadToDeg(angleToPlayer));
        const speed = 300;
        projectile.setVelocity(
            Math.cos(angleToPlayer) * speed,
            Math.sin(angleToPlayer) * speed
        );
        this.projectiles.push(projectile);
        this.scene.time.delayedCall(2000, () => {
            this.CanAttack = true;
        });
    }


    AttackBokoblin(Player){
        let Attacked = false
        this.CanAttack = false
        const attackWidth = 100
        const attackHeight = 200
        const angleToPlayer = Phaser.Math.Angle.Between(this.x, this.y, Player.x, Player.y)
        
        const graphics = this.scene.add.graphics()
        graphics.fillStyle(0xffa500, 0.5)
        graphics.save()
        graphics.translateCanvas(this.x, this.y)
        graphics.rotateCanvas(angleToPlayer)
        graphics.fillRect(0, -attackWidth / 2, attackHeight, attackWidth)
    
        const attackZone = this.scene.add.rectangle(this.x, this.y, attackHeight, attackWidth)
        this.scene.physics.world.enable(attackZone)
        attackZone.setOrigin(0.5, 0.5)
        attackZone.setAngle(Phaser.Math.RadToDeg(angleToPlayer))
        attackZone.body.setOffset(-attackHeight / 2, -attackWidth / 2)
        this.velocity = 0
        setTimeout(() => {
            graphics.clear()
            
            graphics.fillStyle(0xffa500, 1)
            graphics.save()
            graphics.translateCanvas(this.x, this.y)
            graphics.rotateCanvas(angleToPlayer)
            graphics.fillRect(0, -attackWidth / 2, attackHeight, attackWidth)
            this.scene.physics.add.overlap(attackZone, Player, () => {
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

        }, 350);  
    }
}