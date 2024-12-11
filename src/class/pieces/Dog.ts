import { DOG_WEIGHT } from "../../constants/weights.constant";
import { ColorPiece } from "../../types/color-piece.type";
import { Piece } from "./Piece";

export class Dog extends Piece {
    constructor(color: ColorPiece, position: number[]) {
        const weight = DOG_WEIGHT;
        super(color, weight, position, "Dog");
    }
}
