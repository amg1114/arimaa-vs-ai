import { CopyClipboard } from "flowbite";
import { Board, coordinates } from "../types/game-board";
import { AvailableMovement, GameMovement, PushMovement } from "../types/game-movement";
import { buildMinMaxTree, minimax } from "../utils/minmax";
import { gameSimulation } from "../utils/minmax/simulation";
import { showErrorMessage, updateGameTurn } from "../utils/ui/menu";
import { Camel } from "./pieces/Camel";
import { Cat } from "./pieces/Cat";
import { Dog } from "./pieces/Dog";
import { Elephant } from "./pieces/Elephant";
import { Horse } from "./pieces/Horse";
import { Piece } from "./pieces/Piece";
import { Rabbit } from "./pieces/Rabbit";
import { Player, PlayerIA } from "./Player";

export class Game {
    public currentPlayer: Player | PlayerIA;

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
    public id;
    public winType: "byRabbits" | "byTrapped" | "byImmobilization" | null = null;
    public winner: "gold" | "silver" | null = null;

    constructor(canvasHeight: number, canvasWidth: number, playerGold: Player, playerSilver: Player) {
        this.board = Array(8)
            .fill(null)
            .map(() => Array(8).fill(0));

        this.cellHeight = canvasHeight / this.board.length;
        this.cellWidth = canvasWidth / this.board[0].length;

        this.playerGold = this.currentPlayer = playerGold;
        this.playerSilver = playerSilver;
        this.id = Math.random().toString(36).substr(2, 9);
        this.initializeTraps();
    }

    public fillBoard(): void {
        this.staticFill();
    }

    public staticFill(): void {
        const goldPositions = [
            {
                type: Rabbit,
                count: 8,
                positions: [
                    [0, 0],
                    [0, 1],
                    [0, 2],
                    [0, 3],
                    [0, 4],
                    [0, 5],
                    [0, 6],
                    [0, 7],
                ],
            },
            {
                type: Dog,
                count: 2,
                positions: [
                    [1, 0],
                    [1, 1],
                ],
            },
            {
                type: Cat,
                count: 2,
                positions: [
                    [1, 2],
                    [1, 3],
                ],
            },
            {
                type: Horse,
                count: 2,
                positions: [
                    [1, 4],
                    [1, 5],
                ],
            },
            { type: Camel, count: 1, positions: [[1, 6]] },
            { type: Elephant, count: 1, positions: [[1, 7]] },
        ];

        const silverPositions = [
            {
                type: Rabbit,
                count: 8,
                positions: [
                    [7, 0],
                    [7, 1],
                    [7, 2],
                    [7, 3],
                    [7, 4],
                    [7, 5],
                    [7, 6],
                    [7, 7],
                ],
            },
            {
                type: Dog,
                count: 2,
                positions: [
                    [6, 0],
                    [6, 1],
                ],
            },
            {
                type: Cat,
                count: 2,
                positions: [
                    [6, 2],
                    [6, 3],
                ],
            },
            {
                type: Horse,
                count: 2,
                positions: [
                    [6, 4],
                    [6, 5],
                ],
            },
            { type: Camel, count: 1, positions: [[6, 6]] },
            { type: Elephant, count: 1, positions: [[6, 7]] },
        ];

        [this.playerGold, this.playerSilver].forEach((player, index) => {
            const positions = index === 0 ? goldPositions : silverPositions;
            positions.forEach(({ type, positions }) => {
                positions.forEach(([x, y]) => {
                    const piece = new type(player.color, [x, y], this.board, this);
                    player.pieces.push(piece);
                    this.placePiece(piece);
                });
            });
        });
    }

    public randomFill(): void {
        [this.playerGold, this.playerSilver].forEach((player) => {
            let rabbitCount = 8;
            let dogCount = 2;
            let catCount = 2;
            let horseCount = 2;
            let camelCount = 1;
            let elephantCount = 1;

            while (rabbitCount > 0 || dogCount > 0 || catCount > 0 || horseCount > 0 || camelCount > 0 || elephantCount > 0) {
                const y = Math.floor(Math.random() * this.board.length);
                const x = player.color === "silver" ? Math.floor(Math.random() * 2) + 3 : Math.floor(Math.random() * 2) + (this.board[0].length - 2);
                let piece: Piece | null = null;

                if (this.board[x][y] === 0 && rabbitCount > 0) {
                    piece = new Rabbit(player.color, [x, y], this.board, this);
                    rabbitCount--;
                } else if (this.board[x][y] === 0 && dogCount > 0) {
                    piece = new Dog(player.color, [x, y], this.board, this);
                    dogCount--;
                } else if (this.board[x][y] === 0 && catCount > 0) {
                    piece = new Cat(player.color, [x, y], this.board, this);
                    catCount--;
                } else if (this.board[x][y] === 0 && horseCount > 0) {
                    piece = new Horse(player.color, [x, y], this.board, this);
                    horseCount--;
                } else if (this.board[x][y] === 0 && camelCount > 0) {
                    piece = new Camel(player.color, [x, y], this.board, this);
                    camelCount--;
                } else if (this.board[x][y] === 0 && elephantCount > 0) {
                    piece = new Elephant(player.color, [x, y], this.board, this);
                    elephantCount--;
                }
                if (piece) {
                    // console.log(`Piece ${piece.toString()}`, piece.game.id, this.id);
                    player.pieces.push(piece);
                    this.placePiece(piece);
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
     * Checks if the given position is a trap.
     *
     * @param position - The coordinates to check, represented as a tuple [x, y].
     * @returns `true` if the position is a trap, `false` otherwise.
     */
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
     * Sets the available movements for the game.
     *
     * @param movements - An array of AvailableMovement objects representing the possible movements.
     */
    public setAvailableMovements(movements: AvailableMovement[]): void {
        this.availableMovements = movements;
    }

    /**
     * Handles a simple movement of a game piece from one position to another.
     *
     * @param movement - The movement details including the starting position,
     *                   ending position, and the player making the move.
     *
     * @throws {Error} If the player attempts to move an opponent's piece.
     * @throws {Error} If the movement is not valid according to the available movements.
     */
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
            showErrorMessage(`Invalid movement: The piece [${fromX},${fromY}] can't move to that position [${toX},${toY}]`);
            throw new Error(`Invalid movement: The piece [${fromX},${fromY}] can't move to that position [${toX},${toY}]`);
        }

        this.isMoving = false;
        this.board[fromX][fromY] = 0;
        this.board[toX][toY] = piece;

        piece.updatePosition([toX, toY]);
        this.completeMovement(player, movement);
    }

    /**
     * Pushes a movement to the game state.
     *
     * @param movement - The movement to be pushed, containing the starting position, ending position, and the player making the move.
     * @throws Will throw an error if the movement is invalid (i.e., the piece cannot move to the specified position).
     */
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

        this.board[fromX][fromY] = 0;
        this.board[toX][toY] = piece;
        piece.updatePosition([toX, toY]);
        this.floatingPiece = enemyPiece;

        this.completeMovement(player, movement, true);
        this.availableMovements = enemyPiece.getSimpleMovements();
    }

    /**
     * Pushes a piece to a new position on the board.
     *
     * @param {PushMovement} movement - The movement details including the target position and the player making the move.
     * @throws {Error} Throws an error if the movement is invalid.
     */
    public pushPiece(movement: PushMovement): void {
        const { to, player } = movement;
        const [toX, toY] = to;
        const piece = this.floatingPiece!;

        if (!this.availableMovements.some((movement) => movement.coordinates[0] === toX && movement.coordinates[1] === toY)) {
            showErrorMessage("Invalid movement: The piece can't move to that position");
            throw new Error("Invalid movement: The piece can't move to that position");
        }

        this.floatingPiece = null;
        this.board[toX][toY] = piece;
        piece.updatePosition([toX, toY]);

        this.completeMovement(player, movement);
    }

    /**
     * Executes a movement in the game.
     *
     * @param movement - The movement to be executed, containing the starting position,
     *                   ending position, and the player making the move.
     *
     * @throws {Error} If the movement is invalid and the piece cannot move to the specified position.
     */
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
        this.availableMovements = piece.getSimpleMovements();
        this.activeCell = from;
    }

    /**
     * Moves a piece from one position to another on the game board.
     *
     * @param movement - The movement details including the starting position,
     *                   ending position, and the player making the move.
     *
     * @throws {Error} If the movement is invalid and the piece cannot move to the specified position.
     */
    public pullPiece(movement: GameMovement): void {
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
        enemyPiece.updatePosition([fromX, fromY]);

        piece.updatePosition([toX, toY]);
        this.board[toX][toY] = piece;
        this.floatingPiece = null;
        this.completeMovement(player, movement);
    }

    /**
     * Completes the movement of a player in the game.
     *
     * @param player - The player who is making the movement.
     * @param movement - The movement being made by the player, which can be either a GameMovement or a PushMovement.
     * @param skipDisableMove - Optional parameter to skip disabling the move. Defaults to false.
     *
     * This method performs the following actions:
     * - Adds the movement to the history.
     * - Clears the available movements.
     * - Resets the active cell.
     * - If `skipDisableMove` is not true, sets the `isMoving` flag to false.
     * - Decrements the player's remaining turns.
     */
    private completeMovement(player: Player, movement: GameMovement | PushMovement, skipDisableMove = false): void {
        player.turns--;
        this.history.push({ ...movement, turns: player.turns });
        this.availableMovements = [];
        this.activeCell = null;

        if (!skipDisableMove) {
            this.isMoving = false;
            this.deleteTrappedPieces();
            this.checkGameEnd();
        }

        if (player.turns === 0) {
            this.switchPlayer();
        }
    }

    public checkGameEnd(): "gold" | "silver" | null {
        const winByRabbits = this.checkWinByRabbitsAtEnd();
        if (winByRabbits){
            this.winType = "byRabbits";
            this.winner = winByRabbits;
            return winByRabbits;
        }
        
        const winByTrapped = this.checkWinByRabbitsTrapped();
        if (winByTrapped){
            this.winType = "byTrapped";
            this.winner = winByTrapped;
            return winByTrapped;
        }
        
        const winByImmobilization = this.checkWinByImmobilization();
        if (winByImmobilization){
            this.winType = "byImmobilization";
            this.winner = winByImmobilization;
            return winByImmobilization;
        }

        return null;
    }

    private checkWinByRabbitsAtEnd(): "gold" | "silver" | null {
        if (this.currentPlayer.color === "gold" && this.currentPlayer.turns === 0) {
            const goldenRabbits = this.board[0].some((cell) => {
                return cell instanceof Rabbit && cell.color === "gold";
            });

            if (goldenRabbits) return "gold";
        }

        if (this.currentPlayer.color === "silver" && this.currentPlayer.turns === 0) {
            const silverRabbits = this.board[this.board.length - 1].some((cell) => {
                return cell instanceof Rabbit && cell.color === "silver";
            });

            if (silverRabbits) return "silver";
        }

        return null;
    }

    private checkWinByRabbitsTrapped(): "gold" | "silver" | null {
        const pieces = this.getAllPieces();

        const goldenRabbits = pieces.some((cell) => {
            return cell instanceof Rabbit && cell.color === "gold";
        });

        if (!goldenRabbits) return "silver";

        const silverRabbits = pieces.some((cell) => {
            return cell instanceof Rabbit && cell.color === "silver";
        });

        if (!silverRabbits) return "gold";

        return null;
    }

    private checkWinByImmobilization(): "gold" | "silver" | null {
        const pieces = this.getAllPieces();
        const silverPieces = pieces.filter((cell) => cell.color === "silver");
        const goldPieces = pieces.filter((cell) => cell.color === "gold");

        const ableGoldPieces = silverPieces.some((piece) => !piece.isImmobilized());

        if (!ableGoldPieces) return "silver";

        const ableSilverPieces = goldPieces.some((cell) => !cell.isImmobilized());
        if (!ableSilverPieces) return "gold";

        return null;
    }

    /**
     * Checks if any piece is trapped on the board and updates the board state accordingly.
     * A piece is considered trapped if it is on a trap tile and there are no adjacent tiles
     * occupied by pieces of the same color as the current player.
     *
     * This method iterates over all trap tiles on the board, checks if there is a piece
     * on each trap, and then checks the adjacent tiles to determine if the piece is trapped.
     * If a piece is trapped, the corresponding board position is updated.
     */
    private deleteTrappedPieces() {
        this.getTraps().forEach((trap) => {
            const [x, y] = trap;
            const piece = this.getPieceAt(trap);

            if (piece) {
                const adjacentCells = piece.getAdjacentsMovements([x, y]);
                if (
                    !adjacentCells.some((tile) => {
                        const cPiece = this.getPieceAt(tile);
                        return cPiece && cPiece.color === piece.color;
                    })
                ) {
                    this.board[x][y] = 1;
                }
            }
        });
    }

    /**
     * Initializes traps on the game board by setting specific positions to 1.
     * The traps are placed at the following coordinates:
     * @private
     */
    private initializeTraps(): void {
        this.getTraps().forEach((trap) => {
            const [x, y] = trap;
            this.board[x][y] = 1;
        });
    }

    /**
     * Retrieves the coordinates of the traps in the game.
     *
     * @returns {coordinates[]} An array of coordinates where each coordinate is represented as a tuple [x, y].
     */
    public getTraps(): coordinates[] {
        return [
            [2, 2],
            [2, 5],
            [5, 2],
            [5, 5],
        ];
    }

    public getAllPieces(color: "gold" | "silver" | null = null): Piece[] {
        return this.board.flat().filter((cell) => cell instanceof Piece && (color ? cell.color === color : true)) as Piece[];
    }

    /**
     * Places a piece on the game board at the specified position.
     *
     * @param piece - The piece to be placed on the board. The piece object should contain a position property,
     *                which is a tuple [x, y] representing the coordinates on the board.
     */
    private placePiece(piece: Piece): void {
        const [x, y] = piece.position;
        this.board[x][y] = piece;
    }

    /**
     * Switches the current player to the other player and resets their turn count to 4.
     * Updates the game turn with the new current player's color.
     *
     * @private
     */
    private switchPlayer(): void {
        this.currentPlayer.turns = 4;
        this.currentPlayer = this.currentPlayer.color === "gold" ? this.playerSilver : this.playerGold;
        updateGameTurn(this.currentPlayer.color);
    }

    public getBoardStr(board = this.board): string {
        let str = "";
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                const cell = board[i][j];
                if (cell instanceof Piece) {
                    str += cell.color === "gold" ? cell.name.toUpperCase()[0] : cell.name.toLowerCase()[0];
                } else {
                    str += cell;
                }
            }
            str += "\n";
        }
        return str;
    }

    public clone(): Game {
        // Create a new deep game instance
        const newGame = new Game(800, 800, this.playerGold, this.playerSilver);

        newGame.board = this.board.map((row) => row.map((cell) => (cell instanceof Piece ? cell.clone(newGame) : cell)));
        newGame.cellWidth = this.cellWidth;
        newGame.cellHeight = this.cellHeight;
        newGame.activeCell = this.activeCell;
        newGame.currentPlayer = this.currentPlayer.clone();

        if (newGame.currentPlayer.color === "gold") {
            newGame.currentPlayer.pieces = newGame.board.flat().filter((cell) => cell instanceof Piece && cell.color === "gold") as Piece[];
            newGame.playerSilver.pieces = this.playerSilver.pieces.map((piece) => piece.clone(newGame));
        } else {
            newGame.currentPlayer.pieces = newGame.board.flat().filter((cell) => cell instanceof Piece && cell.color === "silver") as Piece[];
            newGame.playerGold.pieces = this.playerGold.pieces.map((piece) => piece.clone(newGame));
        }

        newGame.playerGold = this.playerGold.clone();
        newGame.playerSilver = this.playerSilver.clone();

        newGame.floatingPiece = this.floatingPiece ? this.floatingPiece.clone(newGame) : null;
        newGame.history = this.history.slice();
        newGame.availableMovements = this.availableMovements.slice();
        newGame.isMoving = this.isMoving;

        return newGame;
    }

    public iaMovemovements(): void {
        const tree = buildMinMaxTree(this);
        const minmax = minimax(tree, true);

        console.log("Minmax");
        console.dir(minmax.game.getBoardStr());
        console.log({
            history: minmax.game.history,
            turns: minmax.game.currentPlayer.turns,
        })
        console.dir(tree, { depth: null });
    }
}
