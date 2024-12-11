import { Board } from "../types/game-board";
import { GameMovement } from "../types/game-movement";
import { Dog } from "./pieces/Dog";
import { Elephant } from "./pieces/Elephant";
import { Horse } from "./pieces/Horse";
import { Piece } from "./pieces/Piece";
import { Rabbit } from "./pieces/Rabbit";
import { Player } from "./Player";


export class Game {
    public turn: "GOLD" | "SILVER" = "GOLD";
    public board: Board;
    public activeTile: number[] = [];
    public history: GameMovement[] = [];
    public floatingPiece: Piece | null = null;

    constructor() {
        this.board = Array(8)
            .fill(null)
            .map(() => Array(8).fill(0));

        this.initializeTraps();
    }

    private initializeTraps(): void {
        this.board[2][2] = this.board[2][5] = 1;
        this.board[5][2] = this.board[5][5] = 1;
    }

    public fillBoard(): void {
        this.placePiece(new Rabbit("silver", [1, 0]));
        this.placePiece(new Rabbit("gold", [1, 1]));
        this.placePiece(new Dog("gold", [2, 0]));
        this.placePiece(new Dog("silver", [2, 1]));
        this.placePiece(new Elephant("silver", [6, 3]));
        this.placePiece(new Dog("gold", [5, 3]));
        this.placePiece(new Horse("gold", [6, 2]));
    }

    private placePiece(piece: Piece): void {
        const [x, y] = piece.position;
        this.board[x][y] = piece;
    }

    private getPieceAt(position: number[]): Piece | null {
        const [x, y] = position;
        const cell = this.board[x][y];
        return cell instanceof Piece ? cell : null;
    }

    public movePiece(movement: GameMovement): void {
        const { from, to, player } = movement;
        const [toX, toY] = to;
        const lastMovement = this.history[this.history.length - 1];

        if (this.floatingPiece && from !== null) {
            throw new Error("Invalid movement: You must push a piece");
        }

        if (from) {
            const piece = this.getPieceAt(from);
            if (!piece) {
                throw new Error("Invalid movement: You must select a piece");
            }

            if (!piece.canMove(to, this.board)) {
                throw new Error("Invalid movement: The piece can't move to that position");
            }

            this.board[from[0]][from[1]] = 0; // Remove the selected piece

            if (player.color === piece.color && this.board[toX][toY] === 0) {
                this.simpleMovement(piece, to, player, movement);
                return;
            }

            if (this.board[toX][toY] instanceof Piece && this.board[toX][toY].color !== player.color) {
                this.pushMovement(piece, to, player, movement);
                return;
            }
        }

        if (!this.floatingPiece) {
            throw new Error("Invalid movement: You can't perform a push movement without a floating piece");
        }

        const floatingPiece = this.floatingPiece;
        if (!floatingPiece.canMove(to, this.board, [lastMovement.to])) {
            throw new Error("Invalid movement: The piece can't move to that position");
        }

        this.executeFloatingMovement(to);
        this.completeMovement(player, movement);
    }

    private simpleMovement(piece: Piece, to: number[], player: Player, movement: GameMovement): void {
        const [toX, toY] = to;
        this.board[toX][toY] = piece;
        piece.position = to;
        this.completeMovement(player, movement);
    }

    private pushMovement(piece: Piece, to: number[], player: Player, movement: GameMovement): void {
        const [toX, toY] = to;
        const enemyPiece = this.board[toX][toY] as Piece;

        this.floatingPiece = enemyPiece;
        this.board[toX][toY] = piece;
        piece.position = to;
        this.completeMovement(player, movement);
    }

    private executeFloatingMovement(to: number[]): void {
        const [toX, toY] = to;
        const floatingPiece = this.floatingPiece as Piece;

        this.board[toX][toY] = floatingPiece;
        floatingPiece.position = to;

        this.floatingPiece = null;
    }

    private completeMovement(player: Player, movement: GameMovement): void {
        this.history.push(movement);
        player.turns--;
    }

    

    public pullMovement(): void {
        // Implement pull movement logic
    }
}