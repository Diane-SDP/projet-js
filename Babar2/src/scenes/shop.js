import Phaser from 'phaser';

export class Shop extends Phaser.Scene {
    constructor() {
        super('shop');
        this.selectedWeapon = null;
        this.sword = ""
        this.spear = ""
    }

    preload() {
        this.load.image('sword', './public/assets/sword.png');
        this.load.image('spear', './public/assets/spear.png');
    }

    create() {

        this.sword = this.add.image(this.cameras.main.width / 3, this.cameras.main.height / 2, 'sword')
        .setInteractive()
        .setScale(0.4)
        this.spear = this.add.image(2 * this.cameras.main.width / 3, this.cameras.main.height / 2, 'spear')
        .setInteractive()
        .setScale(0.06)

        this.sword.on('pointerdown', () => this.selectWeapon('sword'));
        this.spear.on('pointerdown', () => this.selectWeapon('spear'));

        const validateButton = this.add.text(this.cameras.main.width / 2, 3 * this.cameras.main.height / 4, 'CHOOSE', { fontSize: '32px', fill: '#FFF' })
            .setOrigin(0.5)
            .setInteractive();
        validateButton.on('pointerdown', () => this.validateSelection());
    }

    selectWeapon(weapon) {
        this.selectedWeapon = weapon;
        if (weapon == "sword") {
            this.sword.setScale(0.5)
            this.spear.setScale(0.06)
        } else {
            this.sword.setScale(0.4)
            this.spear.setScale(0.09)
        }
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
