import { RABBIT_WEIGHT } from "../../constants/weights.constant";
import { ColorPiece } from "../../types/color-piece.type";
import { Piece } from "./Piece";

export class Rabbit extends Piece {
    constructor(color: ColorPiece, position: number[]) {
        const weight = RABBIT_WEIGHT;

        super(color, weight, position);
    }

    move() {
        console.log('Rabbit move');
    }

}