import { Camel } from "./pieces/Camel";
import { Cat } from "./pieces/Cat";
import { Dog } from "./pieces/Dog";
import { Elephant } from "./pieces/Elephant";
import { Horse } from "./pieces/Horse";
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

                // add horses
                if ((j === 0 || j === this.board[i].length - 1) && (i === 1 || i === this.board.length - 2)) {
                    this.board[i][j] = new Horse(i === 1 ? "silver" : "gold", [i, j]);
                }

                // add dogs
                if ((j === 1 || j === this.board[i].length - 2) && (i === 1 || i === this.board.length - 2)) {
                    this.board[i][j] = new Dog(i === 1 ? "silver" : "gold", [i, j]);
                }

                // add cats
                if ((j === 2 || j === this.board[i].length - 3) && (i === 1 || i === this.board.length - 2)) {
                    this.board[i][j] = new Cat(i === 1 ? "silver" : "gold", [i, j]);
                }

                // add camel
                if (j === 3 && (i === 1 || i === this.board.length - 2)) {
                    this.board[i][j] = new Camel(i === 1 ? "silver" : "gold", [i, j]);
                }

                // add elephant
                if (j === 4 && (i === 1 || i === this.board.length - 2)) {
                    this.board[i][j] = new Elephant(i === 1 ? "silver" : "gold", [i, j]);
                }
            }
        }
    }
}
