import { GameMovement } from "../types/game-movement.type";
import { Camel } from "./pieces/Camel";
import { Cat } from "./pieces/Cat";
import { Dog } from "./pieces/Dog";
import { Elephant } from "./pieces/Elephant";
import { Horse } from "./pieces/Horse";
import { Piece } from "./pieces/Piece";
import { Rabbit } from "./pieces/Rabbit";

export class Game {
    public turn: "GOLD" | "SILVER" = "GOLD";
    public steps: number = 4;

    public board: number[][] | Piece[][];
    public active_tile: number[] = [];

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

        this.board[1][0] = new Rabbit("silver", [1, 0]);
        this.board[1][1] = new Rabbit("gold", [1, 1]);
        this.board[2][0] = new Dog("gold", [2, 0]);
        this.board[2][1] = new Dog("silver", [2, 1]);

        this.board[6][3] = new Rabbit("silver", [6, 3]);
        this.board[5][3] = new Elephant("gold", [5, 3]);
        this.board[6][2] = new Horse("silver", [6, 2]);
    }

    public movePiece(movement: GameMovement): void {
        const {from, to} = movement;
        let piece = this.board[from[0]][from[1]];

        if (piece instanceof Number) throw new Error("Invalid movement: You must select a piece");
        piece = piece as Piece;

        if (!piece.canMove(to, this.board)) throw new Error("Invalid movement: The piece can't move to that position");

        this.board[to[0]][to[1]] = piece;
        this.board[from[0]][from[1]] = 0;

        this.steps--;

        if (this.steps === 0) {
            this.turn = this.turn === "GOLD" ? "SILVER" : "GOLD";
            this.steps = 4;
        }
    }
}
