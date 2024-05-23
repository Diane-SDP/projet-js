import Phaser from 'phaser';

export class Shop extends Phaser.Scene {
    constructor() {
        super('shop');
        this.selectedWeapon = null;
    }

    preload() {
        this.load.image('sword', './public/assets/sword.png');
        this.load.image('spear', './public/assets/spear.png');
    }

    create() {

        const sword = this.add.image(this.cameras.main.width / 3, this.cameras.main.height / 2, 'sword')
        .setInteractive()
        .setScale(0.4)
        const spear = this.add.image(2 * this.cameras.main.width / 3, this.cameras.main.height / 2, 'spear')
        .setInteractive()
        .setScale(0.06)

        sword.on('pointerdown', () => this.selectWeapon('sword'));
        spear.on('pointerdown', () => this.selectWeapon('spear'));

        const validateButton = this.add.text(this.cameras.main.width / 2, 3 * this.cameras.main.height / 4, 'CHOOSE', { fontSize: '32px', fill: '#FFF' })
            .setOrigin(0.5)
            .setInteractive();
        validateButton.on('pointerdown', () => this.validateSelection());
    }

    selectWeapon(weapon) {
        this.selectedWeapon = weapon;
        console.log("arme choisie : ", weapon)
    }

    validateSelection() {
        if (this.selectedWeapon) {
            this.scene.start('game', { weapon: this.selectedWeapon });
        } else {
            console.log('No weapon selected!');
        }
    }
}
