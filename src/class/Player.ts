import { ColorPiece } from "../types/color-piece.type";

export class Player {
    public color: ColorPiece;

    constructor(color: ColorPiece) {
        this.color = color;
    }
}
