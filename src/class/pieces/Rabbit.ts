import { RABBIT_WEIGHT } from "../../constants/weights.constant";
import { ColorPiece } from "../../types/color-piece";
import { Board } from "../../types/game-board";
import { Game } from "../Game";
import { Piece } from "./Piece";

export class Rabbit extends Piece {
    constructor(color: ColorPiece, position: number[], board: Board, game: Game) {
        const weight = RABBIT_WEIGHT;

        super(color, weight, board, position, "Rabbit", game);
    }

    /**
     * Determines if the rabbit can move to the specified position on the board.
     *
     * @param to - The target position to move to, represented as an array of coordinates [x, y].
     * @param board - The current state of the board, which can be a 2D array of numbers or pieces.
     * @returns A boolean indicating whether the rabbit can move to the specified position.
     */
    canMove(to: number[]): boolean {
        const [x] = this.position;
        const [toX] = to;

        // check if is moving behind
        if (!this.isFloating && (this.color === "gold" && toX < x) || (this.color === "silver" && toX > x)) return false;

        return super.canMove(to);
    }
}
