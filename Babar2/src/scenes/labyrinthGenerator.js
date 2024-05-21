import { Case } from "./Case";


export class LabyrinthGenerator {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.labyrinth = Array.from({ length: height }, () => Array.from({ length: width }, () => new Case()));
        this.directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
        this.path = [];
    }

    generateLabyrinth() {
        this.tracePath(0, 0); // génère le labyrinthe
        this.labyrinth[9][9].wall = false;
        console.log(this.isResolvable())
        while (!this.isResolvable()) { //le régénère si besoin
            this.labyrinth = Array.from({ length: this.height }, () => Array.from({ length: this.width }, () => new Case()));
            this.tracePath(0, 0);
            console.log(this.isResolvable())
        }
        // this.labyrinth[0][9].wall = true;
        return this.labyrinth;
    }

    tracePath(y, x) { //creuse le labyrinthe, utilise la recherche en profondeur (DFS)
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

    shouldDig(y, x) { // renvoie true si trop de mur à coté pour tracer le chemin, false sinon
        let neighborsDug = 0;
        if (this.isInside(y + 1, x) && this.labyrinth[y + 1][x].wall === false) {
            neighborsDug++;
        }
        if (this.isInside(y - 1, x) && this.labyrinth[y - 1][x].wall === false) {
            neighborsDug++;
        }
        if (this.isInside(y, x + 1) && this.labyrinth[y][x + 1].wall === false) {
            neighborsDug++;
        }
        if (this.isInside(y, x - 1) && this.labyrinth[y][x - 1].wall === false) {
            neighborsDug++;
        }
        return neighborsDug <= 1;
    }

    shuffle(array) { //mélange les directions
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    isInside(y, x) { // vérifie si a case(x,y) existe dans le labyrinthe
        return y >= 0 && x >= 0 && y < this.height && x < this.width;
    }

    isResolvable() { // renvoie true si le labyronthe est faisable
        const stack = [[0, 0]];
        const visited = Array.from({ length: this.height }, () => Array(this.width).fill(false));

        while (stack.length > 0) {
            const [y, x] = stack.pop();
            if (y === 9 && x === 9) {
                return true;
            }
            visited[y][x] = true;

            for (let [dy, dx] of this.directions) {
                const newY = y + dy;
                const newX = x + dx;

                if (this.isInside(newY, newX) && !visited[newY][newX] && this.labyrinth[newY][newX].wall === false) {
                    stack.push([newY, newX]);
                }
            }
        }
        return false;
    }
}
