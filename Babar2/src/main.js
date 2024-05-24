import {GameScene} from "./scenes/gamescene"
import { Labyrinth } from "./scenes/labyrinth";
import {MenuScene} from "./scenes/menuscene"
import {GameOverScene} from "./scenes/gameoverscene"
import { Game } from "phaser";
import { Credits } from "./scenes/creditscene";
import { BossScene } from "./scenes/BossScene";
import Phaser from 'phaser';

export const global = {
    coin: 0
};

var config = {
    type: Phaser.AUTO,
    width: 960,
    height: 540,
    scene: [
        
        MenuScene,
        GameScene,
        GameOverScene,
        BossScene
    ],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    }
}
new Game(config)
