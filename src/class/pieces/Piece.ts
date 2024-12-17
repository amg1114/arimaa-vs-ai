import { ColorPiece } from "../../types/color-piece";
import { coordinates } from "../../types/game-board";
import { AvailableMovement } from "../../types/game-movement";
import { Game } from "../Game";

export class Piece {
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
     * The current position of the piece on the this.game.board.
     * Represented as an array of numbers where each number corresponds to a coordinate.
     */
    public position: number[];

    /**
     * The name of the piece.
     */
    public name: "Rabbit" | "Horse" | "Camel" | "Elephant" | "Dog" | "Cat";

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

    public game: Game;

    constructor(
        color: ColorPiece,
        weight: number,
        position: number[],
        name: "Rabbit" | "Horse" | "Camel" | "Elephant" | "Dog" | "Cat",
        game: Game
    ) {
        this.color = color;
        this.weight = weight;
        this.position = position;
        this.name = name;
        this.icon = `/pieces/${this.color.toLowerCase()}/${this.name.toLowerCase()}.svg`;
        this.game = game;
    }

    updatePosition(position: coordinates): void {
        this.position = position;
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

        if (this.isFreezed() && !this.isFloating) return false;

        // check if is moving to an excluded position
        if (excludedPosition) {
            if (excludedPosition.some((tile) => tile[0] === toX && tile[1] === toY)) return false;
        }

        // check if is moving to outside the board
        if (toX < 0 || toY < 0 || toX >= this.game.board.length || toY >= this.game.board[toX].length) return false;

        // check if is not moving diagonally
        const adjacentTiles = this.getAdjacentsMovements(to);
        if (!adjacentTiles.some((tile) => tile[0] === x && tile[1] === y)) return false;

        // check if is moving to an empty tile
        if (this.game.board[toX][toY] instanceof Piece) return false;

        return true;
    }

    /**
     * Determines if the piece is frozen on the this.game.board.
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

            if (!this.game.board[x][y] || this.game.board[x][y] === 1 || this.game.board[x][y] === 0) continue;
            const piece = this.game.board[x][y] as Piece;

            // If the adjacent piece is from the same color, then the piece is not freezed
            if (piece.color === this.color) return false;

            // If the adjacent piece is heavier, then the piece is freezed
            if (piece.weight >= this.weight) weighterPieces++;
        }

        return weighterPieces > 0;
    }

    isImmobilized(): boolean {
        if (this.isFreezed()) return true;

        const availableMovements = this.getSimpleMovements();
        const pushablePieces = this.getPushablePieces();
        const pullablePieces = this.getPullablePieces();

        return availableMovements.length === 0 && pushablePieces.length === 0 && pullablePieces.length === 0;
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

        if (this.game.board[x - 1] && this.game.board[x - 1][y] !== undefined) adjacents.push([x - 1, y]);
        if (this.game.board[x + 1] && this.game.board[x + 1][y] !== undefined) adjacents.push([x + 1, y]);
        if (this.game.board[x][y - 1] !== undefined) adjacents.push([x, y - 1]);
        if (this.game.board[x][y + 1] !== undefined) adjacents.push([x, y + 1]);

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
    getSimpleMovements(excludedPositions: number[][] | null = null): AvailableMovement[] {
        const adjacentTiles = this.getAdjacentsMovements(this.position);
        let availableMovements: AvailableMovement[] = [];
        
        if (this.name === "Rabbit") {
            excludedPositions = [[this.position[0] - 1, this.position[1]]];
        }

        for (const tile of adjacentTiles) {
            if (this.canMove(tile, excludedPositions)) {
                availableMovements.push({
                    coordinates: tile,
                    type: "simple",
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

        if (this.isFreezed()) return [];

        for (const tile of adjacentTiles) {
            const [x, y] = tile;

            if (this.game.board[x][y] === 0 || this.game.board[x][y] === 1) continue;

            const piece = this.game.board[x][y] as Piece;
            if (piece.color === this.color || piece.weight > this.weight) continue;

            pushablePieces.push({
                coordinates: piece.position,
                type: "push",
            });
        }

        return pushablePieces;
    }

    getAllMovements(): AvailableMovement[] {
        const simpleMovements = this.getSimpleMovements();
        const pushablePieces = this.getPushablePieces();
        const pullablePieces = this.getPullablePieces();

        return [...simpleMovements, ...pushablePieces, ...pullablePieces];
    }

    /**
     * Retrieves the pieces that can be pulled by the current piece.
     * A piece can be pulled if it is adjacent to the current piece,
     * is not of the same color, and has a weight less than the current piece.
     *
     * @param {Board} board - The current state of the game this.game.board.
     * @returns {AvailableMovement[]} An array of pieces that can be pulled by the current piece.
     */
    getPullablePieces(): AvailableMovement[] {
        const adjacentTiles = this.getAdjacentsMovements(this.position);
        let pullablePieces: AvailableMovement[] = [];

        if (this.isFreezed()) return [];

        if (adjacentTiles.some((tile) => this.game.board[tile[0]][tile[1]] === 0)) {
            for (const tile of adjacentTiles) {
                const [x, y] = tile;

                if (this.game.board[x][y] === 0 || this.game.board[x][y] === 1) continue;

                const piece = this.game.board[x][y] as Piece;
                if (piece.color === this.color || piece.weight > this.weight) continue;

                pullablePieces.push({
                    coordinates: piece.position,
                    type: "pull",
                });
            }
        }
        return pullablePieces;
    }

    public toString(): string {
        return `${this.color}${this.name[0]}${this.position[0]}${this.position[1]}`;
    }

    clone(game: Game): Piece {
        return new Piece(this.color, this.weight, this.position, this.name, game);
    }
}
