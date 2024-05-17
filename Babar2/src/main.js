import { Game } from "phaser";
import {MainScene} from "./scenes/mainscene"

function runGame() {
    var config = {
        type: Phaser.AUTO,
        width: 960,
        height: 540,
        scene: [MainScene]
    }
    var game = new Phaser.Game(config);
}

window.onload = function () {
    runGame();
};



function update ()
{
}