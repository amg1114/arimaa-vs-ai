import { ColorPiece } from "../types/color-piece";

export class Player {
    public color: ColorPiece;
    public turns: number = 4;

    constructor(color: ColorPiece) {
        this.color = color;
    }

    public clone() {
        const player = new Player(this.color);
        player.turns = this.turns;
        // player.pieces = this.pieces.map((piece) => piece.clone());

        return player;
    }
}