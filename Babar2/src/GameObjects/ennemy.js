import { GameObjects,Physics } from "phaser";

export class Ennemy extends Physics.Arcade.Image {
    constructor({scene}) {
        super(scene, 400, 200, "bokoblin");
        this.scene = scene;
        this.Maze = []
        this.scene.add.existing(this);
    }   




}