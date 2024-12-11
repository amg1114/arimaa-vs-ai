import { Piece } from "./pieces/Piece";
import { Rabbit } from "./pieces/Rabbit";

export class Game {
    public board: number[][] | Piece[][];
    public turn: "GOLD" | "SILVER" = "GOLD";
    constructor() {
        this.board = [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 1, 0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 1, 0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
        ];
    }

    public fillBoard() {
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[i].length; j++) {
                if (this.board[i][j] === 1) break;

                // Add rabbits
                if (i === 0 || i === this.board.length - 1) {
                    this.board[i][j] = new Rabbit(i === 0 ? "silver" : "gold", [i, j]);
                }

            

            }
        }
    }
}
