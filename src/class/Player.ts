import { ColorPiece } from "../types/color-piece";
import { Piece } from "./pieces/Piece";

export class Player {
    public color: ColorPiece;
    public turns: number = 4;
    public pieces: Piece[] = [];

    constructor(color: ColorPiece) {
        this.color = color;
    }

    public clone() {
        const player = new Player(this.color);
        
        player.turns = this.turns;
        player.pieces = this.pieces.map((piece) => piece.clone());

        return player;
    }
}

export class PlayerIA extends Player {
    constructor(color: ColorPiece) {
        super(color);
    }
}
