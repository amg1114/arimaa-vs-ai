import { Board, coordinates } from "../types/game-board";
import { GameMovement } from "../types/game-movement";
import { showErrorMessage } from "../utils/ui/menu";
import { Dog } from "./pieces/Dog";
import { Elephant } from "./pieces/Elephant";
import { Horse } from "./pieces/Horse";
import { Piece } from "./pieces/Piece";
import { Rabbit } from "./pieces/Rabbit";
import { Player } from "./Player";

export class Game {
    public currentPlayer: Player;

    public playerGold: Player;
    public playerSilver: Player;

    public board: Board;
    public cellWidth: number;
    public cellHeight: number;

    public activeCell: coordinates | null = null;
    public floatingPiece: Piece | null = null;

    public history: GameMovement[] = [];
    public availableMovements: coordinates[] = [];
    
    public isMoving: boolean = false;
    public isPushing: boolean = false;
    public isPulling: boolean = false;

    constructor(canvasHeight: number, canvasWidth: number, playerGold: Player, playerSilver: Player) {
        this.board = Array(8)
            .fill(null)
            .map(() => Array(8).fill(0));

        this.cellHeight = canvasHeight / this.board.length;
        this.cellWidth = canvasWidth / this.board[0].length;

        this.playerGold = playerGold;
        this.currentPlayer = playerGold;
        this.playerSilver = playerSilver;

        this.initializeTraps();
    }

    public fillBoard(): void {
        this.placePiece(new Rabbit("silver", [1, 0]));
        this.placePiece(new Rabbit("gold", [1, 1]));
        this.placePiece(new Elephant("gold", [1, 2]));
        this.placePiece(new Dog("gold", [2, 0]));
        this.placePiece(new Dog("silver", [2, 1]));
        this.placePiece(new Elephant("silver", [6, 3]));
        this.placePiece(new Dog("gold", [5, 3]));
        this.placePiece(new Horse("gold", [6, 2]));
    }

    /**
     * Retrieves the cell coordinates at the specified x and y pixel positions.
     *
     * @param x - The x-coordinate in pixels.
     * @param y - The y-coordinate in pixels.
     * @returns The cell coordinates as a tuple [row, col].
     */
    public getCellAt(x: number, y: number): coordinates {
        const col = Math.floor(x / this.cellWidth);
        const row = Math.floor(y / this.cellHeight);

        return [row, col];
    }

    /**
     * Retrieves the piece at the specified position on the board.
     *
     * @param position - An array containing the x and y coordinates of the position.
     * @returns The piece at the specified position if it exists, otherwise null.
     */
    public getPieceAt(position: number[]): Piece | null {
        const [x, y] = position;
        const cell = this.board[x][y];
        return cell instanceof Piece ? cell : null;
    }

    /**
     * Moves a piece on the game board according to the provided movement.
     *
     * @param {GameMovement} movement - The movement details including the starting position,
     *                                  destination position, and the player making the move.
     *
     * @throws {Error} If the movement is invalid due to various reasons such as:
     *                 - Attempting to push a piece without a floating piece.
     *                 - Selecting a piece that doesn't exist.
     *                 - Moving a piece to an invalid position.
     *                 - Performing a push movement without a floating piece.
     */
    public movePiece(movement: GameMovement): void {
        return;
        // const { from, to, player } = movement;
        // const [toX, toY] = to;
        // const lastMovement = this.history[this.history.length - 1];

        // if (this.floatingPiece && from !== null) {
        //     throw new Error("Invalid movement: You must push a piece");
        // }

        // if (from) {
        //     const piece = this.getPieceAt(from);
        //     if (!piece) {
        //         throw new Error("Invalid movement: You must select a piece");
        //     }

        //     if (!piece.canMove(to, this.board)) {
        //         throw new Error("Invalid movement: The piece can't move to that position");
        //     }

        //     this.board[from[0]][from[1]] = 0; // Remove the selected piece

        //     if (player.color === piece.color && this.board[toX][toY] === 0) {
        //         this.simpleMovement(piece, to, player, movement);
        //         return;
        //     }

        //     if (this.board[toX][toY] instanceof Piece && this.board[toX][toY].color !== player.color) {
        //         this.pushMovement(piece, to, player, movement);
        //         return;
        //     }
        // }

        // if (!this.floatingPiece) {
        //     throw new Error("Invalid movement: You can't perform a push movement without a floating piece");
        // }

        // const floatingPiece = this.floatingPiece;
        // if (!floatingPiece.canMove(to, this.board, [lastMovement.to])) {
        //     throw new Error("Invalid movement: The piece can't move to that position");
        // }

        // this.executeFloatingMovement(to);
        // this.completeMovement(player, movement);
    }

    /**
     * Initializes traps on the game board by setting specific positions to 1.
     * The traps are placed at the following coordinates:
     * - (2, 2)
     * - (2, 5)
     * - (5, 2)
     * - (5, 5)
     *
     * @private
     */
    private initializeTraps(): void {
        this.board[2][2] = this.board[2][5] = 1;
        this.board[5][2] = this.board[5][5] = 1;
    }

    private placePiece(piece: Piece): void {
        const [x, y] = piece.position;
        this.board[x][y] = piece;
    }

    public simpleMovement(movement: GameMovement): void {
        const { from, to, player } = movement;
        const [fromX, fromY] = from!;
        const [toX, toY] = to;
        const piece = this.getPieceAt(from!)!;

        if (player.color !== piece.color) {
            showErrorMessage("Invalid movement: You can't move the opponent's piece");
            throw new Error("Invalid movement: You can't move the opponent's piece");
        }

        if (!this.availableMovements.some((movement) => movement[0] === toX && movement[1] === toY)) {
            showErrorMessage("Invalid movement: The piece can't move to that position");
            throw new Error("Invalid movement: The piece can't move to that position");
        }

        this.board[fromX][fromY] = 0;
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
        this.availableMovements = [];
        this.activeCell = null;

        player.turns--;
    }

    public pullMovement(): void {
        // Implement pull movement logic
    }

    public setAvailableMovements(movements: coordinates[]): void {
        this.availableMovements = movements;
    }
}
