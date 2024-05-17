import { Game } from "phaser";
import {MainScene} from "./scenes/mainscene"

function runGame() {
    var config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
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