import { CAMEL_WEIGHT } from "../../constants/weights.constant";
import { ColorPiece } from "../../types/color-piece";
import { Board } from "../../types/game-board";
import { Piece } from "./Piece";

export class Camel extends Piece {
    constructor(color: ColorPiece, position: number[], board: Board, gameId: string) {
        const weight = CAMEL_WEIGHT;
        super(color, weight, board, position, "Camel", gameId);
    }
}
