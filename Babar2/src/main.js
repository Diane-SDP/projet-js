import {GameScene} from "./scenes/gamescene"
import { Labyrinth } from "./scenes/labyrinth";
import {MenuScene} from "./scenes/menuscene"
import { Game } from "phaser";
import Phaser from 'phaser';


var config = {
    type: Phaser.AUTO,
    width: 960,
    height: 540,
    scene: [
        
        MenuScene,
        GameScene
    ],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    }
}
new Game(config)
