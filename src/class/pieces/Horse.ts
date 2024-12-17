import { HORSE_WEIGHT } from "../../constants/weights.constant";
import { ColorPiece } from "../../types/color-piece";
import { Game } from "../Game";
import { Piece } from "./Piece";

export class Horse extends Piece {
    constructor(color: ColorPiece, position: number[], game:Game) {
        const weight = HORSE_WEIGHT;
        super(color, weight, position, "Horse", game);
    }
}
