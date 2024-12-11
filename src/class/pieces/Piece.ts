import { ColorPiece } from "../../types/color-piece.type";

export class Piece {
    public color: ColorPiece;
    public weight: number;
    public position: number[]

    constructor(color: ColorPiece, weight: number, position: number[]) {
        this.color = color;
        this.weight = weight;
        this.position = position;
    }

    toString() {
        return this.color[0].toUpperCase() + this.constructor.name[0].toUpperCase();
    }
}
