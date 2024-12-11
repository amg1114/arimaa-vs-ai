import { HORSE_WEIGHT } from "../../constants/weights.constant";
import { ColorPiece } from "../../types/color-piece.type";
import { Piece } from "./Piece";

export class Horse extends Piece {
    constructor(color: ColorPiece, position: number[]) {
        const weight = HORSE_WEIGHT;
        super(color, weight, position, "Horse");
    }
    move() {
        console.log("Horse move");
    }
}
