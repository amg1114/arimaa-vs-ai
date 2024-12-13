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
        this.placePiece(new Rabbit("silver", [1, 0], this.board));
        this.placePiece(new Rabbit("gold", [1, 1], this.board));
        this.placePiece(new Elephant("gold", [1, 2], this.board));
        this.placePiece(new Dog("gold", [2, 0], this.board));
        this.placePiece(new Dog("silver", [2, 1], this.board));
        this.placePiece(new Elephant("silver", [6, 3], this.board));
        this.placePiece(new Dog("gold", [5, 3], this.board));
        this.placePiece(new Horse("gold", [6, 2], this.board));
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

    private completeMovement(player: Player, movement: GameMovement): void {
        this.history.push(movement);
        this.availableMovements = [];
        this.activeCell = null;

        player.turns--;
    }

    public setAvailableMovements(movements: coordinates[]): void {
        this.availableMovements = movements;
    }
}
