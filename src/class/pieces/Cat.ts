import { CAT_WEIGHT } from "../../constants/weights.constant";
import { ColorPiece } from "../../types/color-piece";
import { Board } from "../../types/game-board";
import { Game } from "../Game";
import { Piece } from "./Piece";

export class Cat extends Piece {
    constructor(color: ColorPiece, position: number[], board: Board, game: Game) {
        const weight = CAT_WEIGHT;
        super(color, weight, board, position, "Cat", game);
    }
}
