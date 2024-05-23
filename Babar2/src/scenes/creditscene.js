import Phaser from 'phaser';
import { MenuScene } from './menuscene';

export class Credits extends Phaser.Scene {
    constructor() {
        super('Credits');
    }

    preload() {
        
    }

    create() {

        let text = this.add.text(400, 600, 'MERSSI D\' avwoare        JOUAIT \n bambou et diantre', {
            fontSize: '32px',
            fill: '#00ff00',
            align: 'center'
        }).setOrigin(0.5, 0)

        this.tweens.add({
            targets: text,
            y: -text.height,
            duration: 20000,
            ease: 'Linear',
            onComplete: () => {
                this.scene.start("menu")  
            }
        });
    } 
}

