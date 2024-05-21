import Phaser from 'phaser';
import { LabyrinthGenerator } from "./labyrinthGenerator";

export class Labyrinth extends Phaser.Scene {
    constructor() {
        super('Labyrinth');
    }

    preload() {
        this.load.image('wall', '/assets/walls.png');
    }

    create() {
        const width = 20;
        const height = 20;
        const tileSize = 50; 
        const generator = new LabyrinthGenerator(width, height);
        console.log("Laby 1")
        const labyrinth = generator.generateLabyrinth(); //matrice avec 0 si c'est un sol, 1 si c'est un mur

        // console.log(labyrinth)

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                if (labyrinth[y][x] == 1) {
                    this.add.image(x * tileSize, y * tileSize, 'wall').setOrigin(0);
                }
            }
        }


    }
}

