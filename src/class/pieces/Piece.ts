import { ColorPiece } from "../../types/color-piece.type";

export class Piece {
    public color: ColorPiece;
    public weight: number;
    public position: number[];
    public name: string;
    constructor(color: ColorPiece, weight: number, position: number[], name: "Rabbit" | "Horse" | "Camel" | "Elephant" | "Dog" | "Cat") {
        this.color = color;
        this.weight = weight;
        this.position = position;
        this.name = name;
    }

    toString() {
        return this.color[0].toUpperCase() + this.constructor.name[0].toUpperCase();
    }
}
