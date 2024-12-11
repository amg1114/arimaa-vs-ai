import { ColorPiece } from "../../types/color-piece";
import { Board } from "../../types/game-board";

export class Piece {
    /**
     * The color of the piece.
     *
     * @type {ColorPiece}
     */
    public color: ColorPiece;

    /**
     * The weight of the piece.
     * This property represents the weight of the piece and is used to determine
     * various attributes or behaviors that depend on the piece's weight.
     */
    public weight: number;

    /**
     * The current position of the piece on the board.
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

    constructor(color: ColorPiece, weight: number, position: number[], name: "Rabbit" | "Horse" | "Camel" | "Elephant" | "Dog" | "Cat") {
        this.color = color;
        this.weight = weight;
        this.position = position;
        this.name = name;
    }

    /**
     * Determines if the piece can move to the specified position on the board.
     *
     * @param to - The target position as an array of two numbers [toX, toY].
     * @param board - The current state of the board, which can be a 2D array of numbers or pieces.
     * @returns A boolean indicating whether the piece can move to the specified position.
     */
    canMove(to: number[], board: Board, excludedPosition: number[][] | null = null): boolean {
        const [x, y] = this.position;
        const [toX, toY] = to;

        // check if is moving to an excluded position
        if (excludedPosition) {
            if (excludedPosition.some((tile) => tile[0] === toX && tile[1] === toY)) return false;
        }

        // check if is moving to outside the board
        if (toX < 0 || toY < 0 || toX >= board.length || toY >= board[toX].length) return false;

        // check if is not moving diagonally
        const adjacentTiles = this.getAdjacentsMovements(to);

        if (!adjacentTiles.some((tile) => tile[0] === x && tile[1] === y)) return false;

        return true;
    }

    /**
     * Determines if the current piece can push another piece on the board.
     *
     * @param piece - The piece to be pushed.
     * @param board - The game board, represented as a 2D array of numbers or pieces.
     * @returns `true` if the current piece can push the specified piece, otherwise `false`.
     */
    canPush(piece: Piece, board: Board): boolean {
        const adjacentTiles = this.getAdjacentsMovements(piece.position);

        if (!adjacentTiles.some((tile) => board[tile[0]][tile[1]] === 0)) return false;

        if (this.weight < piece.weight) return false;

        return true;
    }

    // To Do:
    // canPull(piece: Piece, board: Board){}

    /**
     * Determines if the piece is frozen on the board.
     * A piece is considered frozen if it is adjacent to a heavier piece of the opposite color
     * and there are no adjacent pieces of the same color.
     *
     * @param board - The game board, which can be a 2D array of numbers or Pieces.
     * @returns `true` if the piece is frozen, `false` otherwise.
     */
    isFreezed(board: Board): boolean {
        let weighterPieces = 0;

        const adjacentTiles = this.getAdjacentsMovements(this.position);

        for (const tile of adjacentTiles) {
            const [x, y] = tile;

            if (!board[x][y] || board[x][y] === 1 || board[x][y] === 0) continue;
            const piece = board[x][y] as Piece;

            // If the adjacent piece is from the same color, then the piece is not freezed
            if (piece.color === this.color) return false;

            // If the adjacent piece is heavier, then the piece is freezed
            if (piece.weight > this.weight) weighterPieces++;
        }

        return weighterPieces > 0;
    }

    /**
     * Returns the adjacent movements for a given position on a 2D grid.
     *
     * @param position - An array containing the x and y coordinates of the current position.
     * @returns An array of arrays, each containing the x and y coordinates of an adjacent position.
     */
    getAdjacentsMovements(position: number[]): number[][] {
        const [x, y] = position;

        return [
            [x - 1, y], // arriba
            [x + 1, y], // abajo
            [x, y - 1], // izquierda
            [x, y + 1], // derecha
        ];
    }

    move() {}

    push() {}

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
    getPushablePieces(board: Board) {
        const adjacentTiles = this.getAdjacentsMovements(this.position);
        let pushablePieces: Piece[] = [];

        for (const tile of adjacentTiles) {
            const [x, y] = tile;

            if (board[x][y] === 0 || board[x][y] === 1) continue;

            const piece = board[x][y] as Piece;
            if (piece.color === this.color || piece.weight > this.weight) continue;

            pushablePieces.push(piece);
        }

        return pushablePieces;
    }

    /**
     * Retrieves the pieces that can be pulled by the current piece.
     * A piece can be pulled if it is adjacent to the current piece, 
     * is not of the same color, and has a weight less than the current piece.
     * 
     * @param {Board} board - The current state of the game board.
     * @returns {Piece[]} An array of pieces that can be pulled by the current piece.
     */
    getPullablePieces(board: Board) {
        const adjacentTiles = this.getAdjacentsMovements(this.position);
        let pullablePieces: Piece[] = [];

        if (adjacentTiles.some((tile) => board[tile[0]][tile[1]] === 0)) {
            for (const tile of adjacentTiles) {
                const [x, y] = tile;

                if (board[x][y] === 0 || board[x][y] === 1) continue;

                const piece = board[x][y] as Piece;
                if (piece.color === this.color || piece.weight > this.weight) continue;

                pullablePieces.push(piece);
            }

            return pullablePieces;
        }
    }
}
