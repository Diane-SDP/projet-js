import Phaser from 'phaser';
import { Scene } from "phaser";
export class MenuScene extends Scene {
    constructor() {
        super('menu');
    }
    preload() {
        this.load.image("backgroundMenu","./public/assets/background.jpg")
        this.load.image("TittleMenu","./public/assets/Tittle.png")
    }
    create() {

        this.add.image(0,0,"backgroundMenu").setOrigin(0, 0)
        this.add.image(20,0,"TittleMenu").setOrigin(0, 0)
        this.scene.start("game");
    }
    update(){

    }

}