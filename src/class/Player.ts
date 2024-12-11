import { ColorPiece } from "../types/color-piece.type";
import { Piece } from "./pieces/Piece";

export class Player {
    public color: ColorPiece;
    public pieces: Piece[] = [];
    public movements: number = 4;
    
    constructor(color: ColorPiece) {
        this.color = color;
    }
}
