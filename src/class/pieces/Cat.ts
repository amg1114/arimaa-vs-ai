import { CAT_WEIGHT } from "../../constants/weights.constant";
import { ColorPiece } from "../../types/color-piece";
import { Game } from "../Game";
import { Piece } from "./Piece";

export class Cat extends Piece {
    constructor(color: ColorPiece, position: number[], game: Game) {
        const weight = CAT_WEIGHT;
        super(color, weight, position, "Cat", game);
    }
}
