import { ColorPiece } from "../../types/color-piece.type";

export class Piece {
    public color: ColorPiece;
    public weight: number;
    public position: number[];
    public name: string;

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
    canMove(to: number[], board: number[][] | Piece[][]): boolean {
        const [x, y] = this.position;
        const [toX, toY] = to;

        // check if is moving to outside the board
        if (toX < 0 || toY < 0 || toX >= board.length || toY >= board[toX].length) return false;

        // check if is not moving diagonally
        const adjacentTiles = this.getAdjacentsMovements(to);

        if (!adjacentTiles.some(tile => tile[0] === x && tile[1] === y)) return false;

        return true;
    }

    /**
     * Determines if the piece is frozen on the board.
     * A piece is considered frozen if it is adjacent to a heavier piece of the opposite color
     * and there are no adjacent pieces of the same color.
     *
     * @param board - The game board, which can be a 2D array of numbers or Pieces.
     * @returns `true` if the piece is frozen, `false` otherwise.
     */
    isFreezed(board: number[][] | Piece[][]): boolean {
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
}
