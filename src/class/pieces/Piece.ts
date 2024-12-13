import { ColorPiece } from "../../types/color-piece";
import { Board, coordinates } from "../../types/game-board";
import { AvailableMovement } from "../../types/game-movement";

export class Piece {
    public board: Board;

    /**
     * The color of the piece.
     *
     * @type {ColorPiece}
     */
    public color: ColorPiece;
    
    /**
     * The icon path of the piece.
     *
     * @type {string}
     */
    public icon;

    /**
     * The weight of the piece.
     * This property represents the weight of the piece and is used to determine
     * various attributes or behaviors that depend on the piece's weight.
     */
    public weight: number;

    /**
     * The current position of the piece on the this.board.
     * Represented as an array of numbers where each number corresponds to a coordinate.
     */
    public position: number[];

    /**
     * The name of the piece.
     */
    public name: string;

    /**
     * Indicates whether the piece is floating.
     *
     * @type {boolean}
     */
    public isFloating: boolean = false;

    /**
     * Indicates whether the piece is currently active.
     * @type {boolean}
     */
    public active: boolean = false;

    constructor(
        color: ColorPiece,
        weight: number,
        board: Board,
        position: number[],
        name: "Rabbit" | "Horse" | "Camel" | "Elephant" | "Dog" | "Cat"
    ) {
        this.color = color;
        this.weight = weight;
        this.board = board;
        this.position = position;
        this.name = name;
        this.icon = `/pieces/${this.color.toLowerCase()}/${this.name.toLowerCase()}.svg`;
    }

    /**
     * Determines if the piece can move to the specified position on the board.
     *
     * @param to - The target position as an array of two numbers [toX, toY].
     * @param board - The current state of the board, which can be a 2D array of numbers or pieces.
     * @returns A boolean indicating whether the piece can move to the specified position.
     */
    canMove(to: number[], excludedPosition: number[][] | null = null): boolean {
        const [x, y] = this.position;
        const [toX, toY] = to;

        // check if is moving to an excluded position
        if (excludedPosition) {
            if (excludedPosition.some((tile) => tile[0] === toX && tile[1] === toY)) return false;
        }

        // check if is moving to outside the board
        if (toX < 0 || toY < 0 || toX >= this.board.length || toY >= this.board[toX].length) return false;

        // check if is not moving diagonally
        const adjacentTiles = this.getAdjacentsMovements(to);
        if (!adjacentTiles.some((tile) => tile[0] === x && tile[1] === y)) return false;

        // check if is moving to an empty tile
        if (this.board[toX][toY] !== 0) return false;

        return true;
    }

    /**
     * Determines if the current piece can push another piece on the this.board.
     *
     * @param piece - The piece to be pushed.
     * @param board - The game board, represented as a 2D array of numbers or pieces.
     * @returns `true` if the current piece can push the specified piece, otherwise `false`.
     */
    canPush(piece: Piece): boolean {
        const adjacentTiles = this.getAdjacentsMovements(piece.position);

        if (!adjacentTiles.some((tile) => this.board[tile[0]][tile[1]] === 0)) return false;

        if (this.color === piece.color) return false;

        if (this.weight <= piece.weight) return false;

        return true;
    }

    // To Do:
    canPull(): void {}

    /**
     * Determines if the piece is frozen on the this.board.
     * A piece is considered frozen if it is adjacent to a heavier piece of the opposite color
     * and there are no adjacent pieces of the same color.
     *
     * @param board - The game board, which can be a 2D array of numbers or Pieces.
     * @returns `true` if the piece is frozen, `false` otherwise.
     */
    isFreezed(): boolean {
        let weighterPieces = 0;

        const adjacentTiles = this.getAdjacentsMovements(this.position);

        for (const tile of adjacentTiles) {
            const [x, y] = tile;

            if (!this.board[x][y] || this.board[x][y] === 1 || this.board[x][y] === 0) continue;
            const piece = this.board[x][y] as Piece;

            // If the adjacent piece is from the same color, then the piece is not freezed
            if (piece.color === this.color) return false;

            // If the adjacent piece is heavier, then the piece is freezed
            if (piece.weight >= this.weight) weighterPieces++;
        }

        return weighterPieces > 0;
    }

    /**
     * Returns the adjacent movements for a given position on a 2D grid.
     *
     * @param position - An array containing the x and y coordinates of the current position.
     * @returns An array of arrays, each containing the x and y coordinates of an adjacent position.
     */
    getAdjacentsMovements(position: number[]): coordinates[] {
        const [x, y] = position;
        let adjacents: coordinates[] = [];

        if (this.board[x - 1] && this.board[x - 1][y] !== undefined) adjacents.push([x - 1, y]);
        if (this.board[x + 1] && this.board[x + 1][y] !== undefined) adjacents.push([x + 1, y]);
        if (this.board[x][y - 1] !== undefined) adjacents.push([x, y - 1]);
        if (this.board[x][y + 1] !== undefined) adjacents.push([x, y + 1]);

        return adjacents;
    }

    /**
     * Retrieves the available movements for the piece on the given board.
     *
     * This method calculates the adjacent tiles to the piece's current position
     * and checks if the piece can move to each of those tiles. If the piece can
     * move to a tile, the tile is added to the list of available movements.
     *
     * @param board - The current state of the board.
     * @returns An array of coordinates representing the available movements.
     */
    getAvailableMovements() {
        const adjacentTiles = this.getAdjacentsMovements(this.position);
        let availableMovements: AvailableMovement[] = [];

        for (const tile of adjacentTiles) {
            if (this.canMove(tile)) {
                availableMovements.push({
                    coordinates: tile,
                    type: "simple"
                });
            }
        }

        return availableMovements;
    }

    /**
     * Retrieves the pieces that can be pushed by the current piece.
     *
     * This method checks the adjacent tiles of the current piece's position
     * to determine which pieces can be pushed. A piece can be pushed if it
     * is not of the same color and has a lesser weight than the current piece.
     *
     * @param board - The game board represented as a 2D array of pieces.
     * @returns An array of pieces that can be pushed by the current piece.
     */
    getPushablePieces() {
        const adjacentTiles = this.getAdjacentsMovements(this.position);
        let pushablePieces: AvailableMovement[] = [];

        for (const tile of adjacentTiles) {
            const [x, y] = tile;

            if (this.board[x][y] === 0 || this.board[x][y] === 1) continue;

            const piece = this.board[x][y] as Piece;
            if (piece.color === this.color || piece.weight > this.weight) continue;

            pushablePieces.push({
                coordinates: piece.position,
                type: "push"
            });
        }

        return pushablePieces;
    }

    /**
     * Retrieves the pieces that can be pulled by the current piece.
     * A piece can be pulled if it is adjacent to the current piece,
     * is not of the same color, and has a weight less than the current piece.
     *
     * @param {Board} board - The current state of the game this.board.
     * @returns {Piece[]} An array of pieces that can be pulled by the current piece.
     */
    getPullablePieces() {
        const adjacentTiles = this.getAdjacentsMovements(this.position);
        let pullablePieces: Piece[] = [];

        if (adjacentTiles.some((tile) => this.board[tile[0]][tile[1]] === 0)) {
            for (const tile of adjacentTiles) {
                const [x, y] = tile;

                if (this.board[x][y] === 0 || this.board[x][y] === 1) continue;

                const piece = this.board[x][y] as Piece;
                if (piece.color === this.color || piece.weight > this.weight) continue;

                pullablePieces.push(piece);
            }

            return pullablePieces;
        }
    }
}
