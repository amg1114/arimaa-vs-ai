import { ELEPHANT_WEIGHT } from "../../constants/weights.constant";
import { ColorPiece } from "../../types/color-piece";
import { Game } from "../Game";
import { Piece } from "./Piece";

export class Elephant extends Piece {
    constructor(color: ColorPiece, position: number[], game: Game) {
        const weight = ELEPHANT_WEIGHT;
        super(color, weight, position, "Elephant", game);
    }
}
