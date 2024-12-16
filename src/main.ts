import "./style.css";

import { Game } from "./class/Game.ts";
import { Piece } from "./class/pieces/Piece.ts";
import { Player, PlayerIA } from "./class/Player.ts";

import { GameMovement } from "./types/game-movement";

import { pullMovementButton, pushMovementButton, simpleMovementButton, disableMenu, showErrorMessage } from "./utils/ui/menu.ts";
import { onCellClick, onCellHover, parseOffsetToCoordinates } from "./utils/ui/events.ts";

import { BLACK_CELL_COLOR, CELL_TEXT_COLOR, drawCell, drawImage, drawSelectedCell, TRAP_CELL_COLOR, WHITE_CELL_COLOR } from "./utils/ui/graphics.ts";
import { Cat } from "./class/pieces/Cat.ts";

const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
const ctx = canvas.getContext("2d")!;

declare global {
    interface Window {
        game: Game;
        piece: Piece;
        playerA: Player;
        playerB: PlayerIA;
        p0: Piece;
        p1: Piece;
        nP: Piece;
    }
}

// Ajustar el tamaño del canvas para alta resolución
const canvasWidth = 600;
const canvasHeight = 600;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

// document ready
const gPlayer = new Player("gold");
const sPlayer = new PlayerIA("silver");
var game = new Game(canvasHeight, canvasWidth, gPlayer, sPlayer);

const cellHeight = game.cellHeight;
const cellWidth = game.cellWidth;

window.game = game;
window.playerA = gPlayer;
window.playerB = sPlayer;


game.fillBoard();

window.p0 = game.getAllPieces()[0]
window.p1 = game.getAllPieces()[1]
window.nP = new Cat("gold", [1, 1], game.board, game.id);
// Canvas Event Listeners
canvas.addEventListener("click", (event: MouseEvent) => {
    const offset = parseOffsetToCoordinates(event, canvas);
    const cell = game.getCellAt(offset[0], offset[1]);

    if (game.isMoving) {
        const movement: GameMovement = {
            from: game.activeCell!,
            to: cell,
            player: game.currentPlayer,
        };

        if (game.isMoving === "simple") {
            game.simpleMovement(movement);
        } else if (game.isMoving === "push") {
            if (!game.floatingPiece) {
                game.pushMovement(movement);
            } else {
                game.pushPiece(movement);
            }
        } else if (game.isMoving === "pull") {
            if (!game.floatingPiece) {
                game.pullMovement(movement);
            } else {
                game.pullPiece(movement);
            }
        }

        disableMenu();
        return;
    }

    onCellClick(event, game, canvas);
});

canvas.addEventListener("mousemove", (event: MouseEvent) => onCellHover(event, game, canvas));

// Controls Event Listeners

simpleMovementButton.addEventListener("click", () => {
    const piece = game.getPieceAt(game.activeCell!);

    if (piece) {
        const movements = piece.getSimpleMovements();
        game.isMoving = "simple";

        game.setAvailableMovements(movements);
    }
});

pushMovementButton.addEventListener("click", () => {
    if (game.currentPlayer.turns < 2) {
        showErrorMessage("You need to play at least 2 turns before pushing a piece");
        throw new Error("You need to play at least 2 turns before pushing a piece");
    }

    const piece = game.getPieceAt(game.activeCell!);
    if (piece) {
        const movements = piece.getPushablePieces();
        game.isMoving = "push";
        game.setAvailableMovements(movements);
    }
});

pullMovementButton.addEventListener("click", () => {
    if (game.currentPlayer.turns < 2) {
        showErrorMessage("You need to play at least 2 turns before pushing a piece");
        throw new Error("You need to play at least 2 turns before pushing a piece");
    }

    const piece = game.getPieceAt(game.activeCell!);
    if (piece) {
        const movements = piece.getPullablePieces();
        game.isMoving = "pull";
        game.setAvailableMovements(movements);
    }
});

function gameLoop() {
    drawBoard();

    requestAnimationFrame(gameLoop);
}

function drawBoard() {
    // clear canvas
    const iceImage = new Image();
    iceImage.src = "/ice.svg";
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // draw board
    for (let i = 0; i < game.board.length; i++) {
        for (let j = 0; j < game.board[i].length; j++) {
            const cX = j * cellWidth;
            const cY = i * cellHeight;
            const color = (i + j) % 2 === 0 ? WHITE_CELL_COLOR : BLACK_CELL_COLOR;
            const availableCell = game.availableMovements.find((movement) => movement.coordinates[0] === i && movement.coordinates[1] === j);

            drawCell(ctx, [cX, cY], cellWidth, cellHeight, color);

            if (game.isTrap([i, j])) {
                drawCell(ctx, [cX, cY], cellWidth, cellHeight, TRAP_CELL_COLOR);
            }

            if (availableCell) {
                switch (availableCell.type) {
                    case "push":
                        drawCell(ctx, [cX, cY], cellWidth, cellHeight, "blue");

                        break;
                    case "pull":
                        drawCell(ctx, [cX, cY], cellWidth, cellHeight, "yellow");

                        break;
                    case "simple":
                        drawCell(ctx, [cX, cY], cellWidth, cellHeight, "green");
                        break;
                    default:
                        drawCell(ctx, [cX, cY], cellWidth, cellHeight, "green");
                        break;
                }
            }

            if (game.board[i][j] instanceof Piece) {
                const piece = game.board[i][j] as Piece;
                const image = new Image();
                image.src = piece.icon;

                drawImage(ctx, image.src, [cX, cY], cellWidth, cellHeight);
                if (piece.isFreezed()) {
                    drawImage(ctx, "ice-cell.png", [cX, cY], cellWidth, cellHeight);
                }
            }

            // add index to tile
            ctx.font = "10px Arial";
            ctx.fillStyle = CELL_TEXT_COLOR;

            if (j === 0) {
                ctx.fillText(`${i }`, j * cellWidth + 5, i * cellHeight + 10);
            } else if (i === 0) {
                ctx.fillText(`${j }`, j * cellWidth + 5, i * cellHeight + 10);
            }
        }
    }

    if (game.activeCell) {
        const [row, col] = game.activeCell;
        drawSelectedCell(ctx, [col * cellWidth, row * cellHeight], cellWidth, cellHeight);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    disableMenu();
});

gameLoop();
