import { Board, coordinates } from "../types/game-board";
import { AvailableMovement, GameMovement, PushMovement } from "../types/game-movement";
import { showErrorMessage } from "../utils/ui/menu";
import { Camel } from "./pieces/Camel";
import { Cat } from "./pieces/Cat";
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

    public history: (GameMovement | PushMovement)[] = [];
    public availableMovements: AvailableMovement[] = [];

    public isMoving: "push" | "pull" | "simple" | false = false;

    constructor(canvasHeight: number, canvasWidth: number, playerGold: Player, playerSilver: Player) {
        this.board = Array(8)
            .fill(null)
            .map(() => Array(8).fill(0));

        this.cellHeight = canvasHeight / this.board.length;
        this.cellWidth = canvasWidth / this.board[0].length;

        this.playerGold = playerGold;
        this.currentPlayer = playerSilver;
        this.playerSilver = playerSilver;

        this.initializeTraps();
    }

    public fillBoard(): void {
        this.placePiece(new Rabbit("silver", [1, 0], this.board));
        this.placePiece(new Camel("gold", [1, 1], this.board));
        this.placePiece(new Dog("gold", [2, 0], this.board));
        this.placePiece(new Dog("silver", [2, 1], this.board));
        this.placePiece(new Dog("silver", [2, 1], this.board));
        this.placePiece(new Elephant("silver", [6, 3], this.board));
        this.placePiece(new Dog("gold", [5, 3], this.board));
        this.placePiece(new Horse("gold", [6, 2], this.board));
    }

    public randomFill(): void {
        // fill gold pieces
        [this.playerGold, this.playerSilver].forEach((player) => {
            let rabbitCount = 8;
            let dogCount = 2;
            let catCount = 2;
            let horseCount = 2;
            let camelCount = 1;
            let elephantCount = 1;

            while (rabbitCount > 0 || dogCount > 0 || catCount > 0 || horseCount > 0 || camelCount > 0 || elephantCount > 0) {
                // Define x and y coordinates here
                const y = Math.floor(Math.random() * this.board.length);
                const x = player.color === "silver" ? Math.floor(Math.random() * 2) : Math.floor(Math.random() * 2) + (this.board[0].length - 2);

                if (this.board[x][y] === 0 && rabbitCount > 0) {
                    this.placePiece(new Rabbit(player.color, [x, y], this.board));
                    rabbitCount--;
                } else if (this.board[x][y] === 0 && dogCount > 0) {
                    this.placePiece(new Dog(player.color, [x, y], this.board));
                    dogCount--;
                } else if (this.board[x][y] === 0 && catCount > 0) {
                    this.placePiece(new Cat(player.color, [x, y], this.board));
                    catCount--;
                } else if (this.board[x][y] === 0 && horseCount > 0) {
                    this.placePiece(new Horse(player.color, [x, y], this.board));
                    horseCount--;
                } else if (this.board[x][y] === 0 && camelCount > 0) {
                    this.placePiece(new Camel(player.color, [x, y], this.board));
                    camelCount--;
                } else if (this.board[x][y] === 0 && elephantCount > 0) {
                    this.placePiece(new Elephant(player.color, [x, y], this.board));
                    elephantCount--;
                }
            }
        });
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

    public isTrap(position: coordinates): boolean {
        const [x, y] = position;
        const traps = [
            [2, 2],
            [2, 5],
            [5, 2],
            [5, 5],
        ];

        return traps.some((trap) => trap[0] === x && trap[1] === y);
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

        if (!this.availableMovements.some((movement) => movement.coordinates[0] === toX && movement.coordinates[1] === toY)) {
            showErrorMessage("Invalid movement: The piece can't move to that position");
            throw new Error("Invalid movement: The piece can't move to that position");
        }

        this.isMoving = false;
        this.board[fromX][fromY] = 0;
        this.board[toX][toY] = piece;

        piece.position = to;
        this.completeMovement(player, movement);
    }

    public pushMovement(movement: GameMovement): void {
        const { from, to, player } = movement;
        const [fromX, fromY] = from!;
        const [toX, toY] = to;
        const piece = this.getPieceAt(from!)!;

        if (!this.availableMovements.some((movement) => movement.coordinates[0] === toX && movement.coordinates[1] === toY)) {
            showErrorMessage("Invalid movement: The piece can't move to that position");
            throw new Error("Invalid movement: The piece can't move to that position");
        }

        const enemyPiece = this.getPieceAt(to)!;

        piece.position = to;
        this.board[fromX][fromY] = 0;
        this.board[toX][toY] = piece;
        this.floatingPiece = enemyPiece;

        this.completeMovement(player, movement, true);
        this.availableMovements = enemyPiece.getAvailableMovements(true);
    }

    public pushPiece(movement: PushMovement): void {
        const { to, player } = movement;
        const [toX, toY] = to;
        const piece = this.floatingPiece!;

        if (!this.availableMovements.some((movement) => movement.coordinates[0] === toX && movement.coordinates[1] === toY)) {
            showErrorMessage("Invalid movement: The piece can't move to that position");
            throw new Error("Invalid movement: The piece can't move to that position");
        }

        this.board[toX][toY] = piece;
        piece.position = to;

        this.floatingPiece = null;
        this.completeMovement(player, movement);
    }

    public pullMovement(movement: GameMovement): void {
        const { from, to, player } = movement;
        const [toX, toY] = to;
        const piece = this.getPieceAt(from)!;

        if (!this.availableMovements.some((movement) => movement.coordinates[0] === toX && movement.coordinates[1] === toY)) {
            showErrorMessage("Invalid movement: The piece can't move to that position");
            throw new Error("Invalid movement: The piece can't move to that position");
        }

        const enemyPiece = this.getPieceAt(to)!;
        this.floatingPiece = enemyPiece;

        this.completeMovement(player, movement, true);
        this.availableMovements = piece.getAvailableMovements(true);
        this.activeCell = from;
    }

    public pullPiece(movement: GameMovement): void {
        console.log(movement);
        const { from, to, player } = movement;
        const [fromX, fromY] = from!;
        const [toX, toY] = to;
        const piece = this.getPieceAt(from)!;
        const enemyPiece = this.floatingPiece!;

        if (!this.availableMovements.some((movement) => movement.coordinates[0] === toX && movement.coordinates[1] === toY)) {
            showErrorMessage("Invalid movement: The piece can't move to that position");
            throw new Error("Invalid movement: The piece can't move to that position");
        }

        this.board[enemyPiece.position[0]][enemyPiece.position[1]] = 0;
        this.board[fromX][fromY] = enemyPiece;
        enemyPiece.position = from;

        piece.position = to;
        this.board[toX][toY] = piece;
        this.floatingPiece = null;
        this.completeMovement(player, movement);
    }

    private completeMovement(player: Player, movement: GameMovement | PushMovement, skipDisableMove = false): void {
        this.history.push(movement);
        this.availableMovements = [];
        this.activeCell = null;

        if (!skipDisableMove) {
            this.isMoving = false;
        }

        player.turns--;
    }

    public setAvailableMovements(movements: AvailableMovement[]): void {
        this.availableMovements = movements;
    }
}
