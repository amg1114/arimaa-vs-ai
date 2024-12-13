import { Board, coordinates } from "../types/game-board";
import { GameMovement } from "../types/game-movement";
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
                const x = player.color === 'silver' ? Math.floor(Math.random() * 2) : Math.floor(Math.random() * 2) + (this.board[0].length - 2);
    
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

        if (!this.availableMovements.some((movement) => movement[0] === toX && movement[1] === toY)) {
            showErrorMessage("Invalid movement: The piece can't move to that position");
            throw new Error("Invalid movement: The piece can't move to that position");
        }

        this.isMoving = false;
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
