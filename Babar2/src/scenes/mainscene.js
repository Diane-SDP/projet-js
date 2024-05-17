import Phaser from 'phaser';
export class MainScene extends Phaser.Scene {

    constructor() {
        super('main');
    }

    preload() {
        this.load.image('background', './public/assets/wallpaper.jpg');

    }

    create() {
        console.log("pute");
        // this.add.image(400, 300, 'background');
        // background.setOrigin(0, 0); // Set origin to the top-left corner
        //background.setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);
    }
}
