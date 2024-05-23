import {GameScene} from "./scenes/gamescene"
import {Shop} from "./scenes/shop"
import { Labyrinth } from "./scenes/labyrinth";
import {MenuScene} from "./scenes/menuscene"
import {GameOverScene} from "./scenes/gameoverscene"
import { Game } from "phaser";
import { Credits } from "./scenes/creditscene";
import Phaser from 'phaser';


var config = {
    type: Phaser.AUTO,
    width: 960,
    height: 540,
    scene: [
        MenuScene,
        Shop,
        GameScene,
        GameOverScene
    ],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    }
}
new Game(config)
