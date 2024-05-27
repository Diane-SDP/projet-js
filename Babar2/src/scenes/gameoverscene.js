import Phaser, { Game } from 'phaser';
import { Scene } from "phaser";
import {global} from "../main"

export class GameOverScene extends Scene {
    constructor() {
        super('gameover');
    }
    create(){
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const style = { 
            fontFamily: '"BOTW"',
            fontSize: '32px',
            fill: '#f00'
        };

        const GameOver = this.add.text(screenCenterX, 250, 'Perdu ! ', style).setOrigin(0.5);
        style = { 
            fontFamily: '"BOTW"',
            fontSize: '32px',
            fill: '#bbb'
        };
        const Retry = this.add.text(screenCenterX, 350, 'Recommencer', style).setOrigin(0.5);
        Retry.setInteractive();
        Retry.on('pointerover', () => { Retry.setFill("#f00") });
        Retry.on('pointerout', () => { Retry.setFill("#bbb") });
        Retry.on('pointerdown', () => this.scene.start("shop"))
    }
}