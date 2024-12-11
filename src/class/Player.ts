import { ColorPiece } from "../types/color-piece.type";

export class Player {
    public color: ColorPiece;
    public turns: number = 4;
    
    constructor(color: ColorPiece) {
        this.color = color;
    }
}
