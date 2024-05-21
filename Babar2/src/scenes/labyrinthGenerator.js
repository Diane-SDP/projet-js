export class LabyrinthGenerator {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.labyrinth = Array.from({ length: height }, () => Array(width).fill(1));
        this.visited = Array.from({ length: height }, () => Array(width).fill(false));
        this.directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
        this.path = [];
    }

    generateLabyrinth() {
        this.tracePath(0, 0);
        this.labyrinth[9][9] = 0;
        console.log("faisable ?", this.isResolvable())
        while (!this.isResolvable()) {
             this.labyrinth = Array.from({ length: this.height }, () => Array(this.width).fill(1));
             this.visited = Array.from({ length: this.height }, () => Array(this.width).fill(false));
             this.tracePath(0, 0);
        }
        return this.labyrinth;
    }

    tracePath(y, x) {
        this.visited[y][x] = true;
        this.labyrinth[y][x] = 0;

        const randDirections = this.shuffle(this.directions);

        for (let [dy, dx] of randDirections) {
            const newY = y + dy;
            const newX = x + dx;

            if (this.isInside(newY, newX) && !this.visited[newY][newX]) {
                if (this.shouldDig(newY, newX)) {
                    this.tracePath(newY, newX);
                }
            }
        }
    }

    shouldDig(y, x) {
        let neighborsDug = 0;
        if (this.isInside(y + 1, x) && this.labyrinth[y + 1][x] === 0) {
            neighborsDug++;
        }
        if (this.isInside(y - 1, x) && this.labyrinth[y - 1][x] === 0) {
            neighborsDug++;
        }
        if (this.isInside(y, x + 1) && this.labyrinth[y][x + 1] === 0) {
            neighborsDug++;
        }
        if (this.isInside(y, x - 1) && this.labyrinth[y][x - 1] === 0) {
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

    isResolvable() {
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

                if (this.isInside(newY, newX) && !visited[newY][newX] && this.labyrinth[newY][newX] === 0) {
                    stack.push([newY, newX]);
                }
            }
        }
        return false;
    }
}
