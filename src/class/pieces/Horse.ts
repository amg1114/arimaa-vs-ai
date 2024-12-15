import { HORSE_WEIGHT } from "../../constants/weights.constant";
import { ColorPiece } from "../../types/color-piece";
import { Board } from "../../types/game-board";
import { Piece } from "./Piece";

export class Horse extends Piece {
    constructor(color: ColorPiece, position: number[], board: Board) {
        const weight = HORSE_WEIGHT;
        super(color, weight, board, position, "Horse");
    }
}
