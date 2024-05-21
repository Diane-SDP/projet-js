import { Case } from "./Case";

export class LabyrinthGenerator {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.labyrinth = Array.from({ length: height }, () => Array(width).fill(new Case()));
        // this.visited = Array.from({ length: height }, () => Array(width).fill(false));
        this.directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
        this.path = [];
    }

    generateLabyrinth() {
        this.tracePath(0, 0);
        return this.labyrinth;
    }

    tracePath(y, x) {
        this.labyrinth[y][x].visited = true;
        this.labyrinth[y][x].wall = false;

        const randDirections = this.shuffle(this.directions);

        for (let [dy, dx] of randDirections) {
            const newY = y + dy;
            const newX = x + dx;

            if (this.isInside(newY, newX) && !this.labyrinth[newY][newX].visited) {
                if (this.shouldDig(newY, newX)) {
                    this.tracePath(newY, newX);
                }
            }
        }
    }

    shouldDig(y, x) {
        let neighborsDug = 0;
        if (this.isInside(y + 1, x) && this.labyrinth[y + 1][x].wall == false) {
            neighborsDug++;
        }
        if (this.isInside(y - 1, x) && this.labyrinth[y - 1][x].wall == false) {
            neighborsDug++;
        }
        if (this.isInside(y, x + 1) && this.labyrinth[y][x + 1].wall == false) {
            neighborsDug++;
        }
        if (this.isInside(y, x - 1) && this.labyrinth[y][x - 1].wall == false) {
            neighborsDug++;
        }
        return neighborsDug <= 1;
    }

    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    isInside(y, x) {
        return y >= 0 && x >= 0 && y < this.height && x < this.width;
    }
}
