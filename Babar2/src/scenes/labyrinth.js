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
        const width = 10;
        const height = 10;
        const tileSize = 50; 
        const generator = new LabyrinthGenerator(width, height);
        const labyrinth = generator.generateLabyrinth(); 


        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                if (labyrinth[y][x].wall) {
                    this.add.image(x * tileSize, y * tileSize, 'wall').setOrigin(0);
                }
            }
        }


    }
}

