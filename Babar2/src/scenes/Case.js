import { Ennemy } from "../GameObjects/ennemy";

export class Case {
    constructor() {
        this.special = ""
        this.wind =""
        this.wall = true
        this.visited = false
        this.discovered = false
        this.Ennemies = []
    } 
}