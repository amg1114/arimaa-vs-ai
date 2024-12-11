import { CAMEL_WEIGHT } from "../../constants/weights.constant";
import { ColorPiece } from "../../types/color-piece.type";
import { Piece } from "./Piece";

export class Camel extends Piece {
    constructor(color: ColorPiece, position: number[]) {
        const weight = CAMEL_WEIGHT;
        super(color, weight, position, "Camel");
    }
}
