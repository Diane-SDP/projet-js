import Phaser from 'phaser';
import { Scene } from "phaser";

export class MenuScene extends Scene {
    constructor() {
        super('menu');
    }
    loadFont(name, url) {
        var newFont = new FontFace(name, `url(${url})`);
        newFont.load().then(function (loaded) {
            document.fonts.add(loaded);
        }).catch(function (error) {
            return error;
        });
    }
    preload() {
        this.load.image("backgroundMenu","./public/assets/background.jpg")
        this.load.image("TittleMenu","./public/assets/Tittle.png")
    }
    create() {

        this.add.image(0,0,"backgroundMenu").setOrigin(0, 0)
        this.add.image(20,0,"TittleMenu").setOrigin(0, 0)
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2; 
        const style = { 
            fontFamily: '"BOTW"',
            fontSize: '32px',
            fill: '#f00'
        };
        const startButton = this.add.text(screenCenterX, screenCenterY, 'Jouer', style).setOrigin(0.5);
        startButton.setInteractive();
        startButton.on('pointerover', () => { startButton.setFill("#0f0") });
        startButton.on('pointerout', () => { startButton.setFill("#f00") });
        startButton.on('pointerdown', () => this.scene.start("shop"))
        // this.scene.start("game");
    }
    update(){

    }


}