import { Ennemy } from "../GameObjects/ennemy";

export class Case {
    constructor() {
        this.special = ""
        this.wind =""
        this.wall = true
        this.visited = false
        this.discovered = false
        this.Ennemies = []
        this.heart = false
    } 

    checkEnnemies() {
        if (this.Ennemies.length == 0) {
            return false
        }
        for (let i = 0; i < this.Ennemies.length; i++ ) {
            if ((this.Ennemies[i] != undefined) &&(this.Ennemies[i] != null)){
                return false
            }
        }
        this.heart = true
        return true
    }
   
}