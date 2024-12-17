import { CAMEL_WEIGHT } from "../../constants/weights.constant";
import { ColorPiece } from "../../types/color-piece";
import { Game } from "../Game";
import { Piece } from "./Piece";

export class Camel extends Piece {
    constructor(color: ColorPiece, position: number[], game: Game) {
        const weight = CAMEL_WEIGHT;
        super(color, weight, position, "Camel", game);
    }
}
