import { Game } from "phaser";
import {MainScene} from "./scenes/mainscene"
import { Labyrinth } from "./scenes/labyrinth";

function runGame() {
    var config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        scene: [Labyrinth]
    }
    var game = new Phaser.Game(config);
}

window.onload = function () {
    runGame();
};



function update ()
{
}