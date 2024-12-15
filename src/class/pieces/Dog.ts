import { DOG_WEIGHT } from "../../constants/weights.constant";
import { ColorPiece } from "../../types/color-piece";
import { Board } from "../../types/game-board";
import { Piece } from "./Piece";

export class Dog extends Piece {
    constructor(color: ColorPiece, position: number[], board: Board) {
        const weight = DOG_WEIGHT;
        super(color, weight, board, position, "Dog");
    }
}
