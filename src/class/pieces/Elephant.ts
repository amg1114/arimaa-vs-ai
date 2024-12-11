import { ELEPHANT_WEIGHT } from "../../constants/weights.constant";
import { ColorPiece } from "../../types/color-piece.type";
import { Piece } from "./Piece";

export class Elephant extends Piece {
    constructor(color: ColorPiece, position: number[]) {
        const weight = ELEPHANT_WEIGHT;
        super(color, weight, position);
    }
}
