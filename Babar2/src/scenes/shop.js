import Phaser from 'phaser';
import {global} from "../main"


export class Shop extends Phaser.Scene {
    constructor() {
        super('shop');
        
    }

    preload() {
        this.load.image('sword', './public/assets/sword.png');
        this.load.image('spear', './public/assets/spear.png');
    }

    create() {
        this.resetShop()
        this.sword = this.add.image(this.cameras.main.width / 3, this.cameras.main.height / 2, 'sword')
        .setInteractive()
        .setScale(0.4)
        this.spear = this.add.image(2 * this.cameras.main.width / 3, this.cameras.main.height / 2, 'spear')
        .setInteractive()
        .setScale(0.06)

        this.sword.on('pointerdown', () => this.selectWeapon('sword'));
        this.spear.on('pointerdown', () => this.selectWeapon('spear'));

        const validateButton = this.add.text(this.cameras.main.width / 2, 3 * this.cameras.main.height / 4, 'Selectionnez', { fontSize: '32px', fill: '#FFF' })
            .setOrigin(0.5)
            .setInteractive();
        validateButton.on('pointerdown', () => this.validateSelection());
        this.coinsText = this.add.text(this.cameras.main.width - 20, 20, `Rubis: ${global.coin}`, { fontSize: '24px', fill: '#FFF' })
            .setOrigin(1, 0)
        this.updateCoinsText()
        this.UpgradeButtons()
        let cheatCode = ''
        const cheatCodeTarget = 'kevin'
        this.input.keyboard.on('keydown', (event) => {
            cheatCode += event.key
        
            if (cheatCode.includes(cheatCodeTarget)) {
                cheatCode = ''
                global.coin += 100
                this.updateCoinsText()
                this.UpgradeButtons()
            } else if (cheatCode.length > cheatCodeTarget.length) {
                cheatCode = cheatCode.substring(1);
            }
        });
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
    }

    validateSelection() {
        if (this.selectedWeapon) {
            this.scene.start('game', { weapon: this.selectedWeapon });
        } else {
        }
    }

    resetShop() {
        this.selectedWeapon = null
        this.sword = ""
        this.spear = ""
        this.upgradeWeapon = null
        this.upgradeHeart = null
    }

    UpgradeButtons() {
        const weaponUpgradeCost = 25 + 5 * global.nbWeaponBonus;
        const heartUpgradeCost = 30;

        if (this.upgradeWeapon == null  && this.upgradeHeart == null) {
            this.upgradeWeapon = this.add.text(this.cameras.main.width / 2, 3 * this.cameras.main.height / 4 + 50, `Upgrade Attack (${weaponUpgradeCost} coins)`, { fontSize: '24px', fill: '#FFF' })
            .setOrigin(0.5)
            .setInteractive()
            this.upgradeHeart = this.add.text(this.cameras.main.width / 2, 3 * this.cameras.main.height / 4 + 100, `Add Heart (${heartUpgradeCost} coins)`, { fontSize: '24px', fill: '#FFF' })
                .setOrigin(0.5)
                .setInteractive()
            this.upgradeWeapon.on('pointerdown', () => {
                    if (global.coin >= weaponUpgradeCost && global.nbWeaponBonus < 5) {
                        global.coin -= weaponUpgradeCost
                        global.nbWeaponBonus += 1
                        this.updateUpgrades()
                    }
                });
        
            this.upgradeHeart.on('pointerdown', () => {
                    if (global.coin >= heartUpgradeCost && global.nbHeartBonus < 5) {
                        global.coin -= heartUpgradeCost
                        global.nbHeartBonus += 1
                        this.updateUpgrades()
                    }
                });
        }

        this.updateUpgrades();

        
    }

    updateUpgrades() {
        const weaponUpgradeCost = 25 + 5 * global.nbWeaponBonus

        this.upgradeWeapon.setText(`Ameliorez votre attaque : (${weaponUpgradeCost} rubis) - Level ${global.nbWeaponBonus}/5`)
        if (global.nbWeaponBonus >= 5 || global.coin < weaponUpgradeCost) {
            this.upgradeWeapon.disableInteractive().setStyle({ fill: '#888' })
        } else {
            this.upgradeWeapon.setInteractive().setStyle({ fill: '#FFF' })
        }

        const heartUpgradeCost = 30;
        this.upgradeHeart.setText(`Ajoutez des coeurs (${heartUpgradeCost} rubis) - Level ${global.nbHeartBonus}/5`)
        if (global.nbHeartBonus >= 5 || global.coin < heartUpgradeCost) {
            this.upgradeHeart.disableInteractive().setStyle({ fill: '#888' })
        } else {
            this.upgradeHeart.setInteractive().setStyle({ fill: '#FFF' })
        }
        this.updateCoinsText()      
    }

    updateCoinsText() {
        this.coinsText.setText(`Rubis: ${global.coin}`);
    }

}
