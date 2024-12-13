import "./style.css";

import { Game } from "./class/Game.ts";
import { Piece } from "./class/pieces/Piece.ts";
import { Player } from "./class/Player.ts";

import { GameMovement } from "./types/game-movement";

import { pullMovementButton, pushMovementButton, simpleMovementButton, disableMenu } from "./utils/ui/menu.ts";
import { onCellClick, onCellHover, parseOffsetToCoordinates } from "./utils/ui/events.ts";

import { BLACK_CELL_COLOR, CELL_TEXT_COLOR, drawCell, drawImage, drawSelectedCell, TRAP_CELL_COLOR, WHITE_CELL_COLOR } from "./utils/ui/graphics.ts";

const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
const ctx = canvas.getContext("2d")!;

declare global {
    interface Window {
        game: Game;
        playerA: Player;
    }
}

// Ajustar el tamaño del canvas para alta resolución
const canvasWidth = 600;
const canvasHeight = 600;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

// document ready
const gPlayer = new Player("gold");
const sPlayer = new Player("silver");
var game = new Game(canvasHeight, canvasWidth, gPlayer, sPlayer);

const cellHeight = game.cellHeight;
const cellWidth = game.cellWidth;

window.game = game;
window.playerA = new Player("silver");

game.fillBoard();

// Canvas Event Listeners
canvas.addEventListener("click", (event: MouseEvent) => {
    const offset = parseOffsetToCoordinates(event, canvas);
    const cell = game.getCellAt(offset[0], offset[1]);

    console.log({ cell });
    if (game.isMoving) {
        const movement: GameMovement = {
            from: game.activeCell!,
            to: cell,
            player: game.currentPlayer,
        };

        game.simpleMovement(movement);
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
        const movements = piece.getAvailableMovements();
        game.isMoving = true;

        game.setAvailableMovements(movements);
    }
});

pushMovementButton.addEventListener("click", () => {
    console.log("Push Movement");
});

pullMovementButton.addEventListener("click", () => {
    console.log("Pull Movement");
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

            drawCell(ctx, [cX, cY], cellWidth, cellHeight, color);

            if (game.isTrap([i, j])) {
                drawCell(ctx, [cX, cY], cellWidth, cellHeight, TRAP_CELL_COLOR);
            }

            if (game.board[i][j] instanceof Piece) {
                const piece = game.board[i][j] as Piece;
                const image = new Image();
                image.src = piece.icon;
                
                if (piece.isFreezed()) {
                    drawImage(ctx, "ice-cell.png", [cX, cY], cellWidth, cellHeight);
                }
                drawImage(ctx, image.src, [cX, cY], cellWidth, cellHeight);

            } else {
                if (game.availableMovements.some((movement) => movement[0] === i && movement[1] === j)) {
                    drawCell(ctx, [cX, cY], cellWidth, cellHeight, "green");
                }
            }

            // add index to tile
            ctx.font = "10px Arial";
            ctx.fillStyle = CELL_TEXT_COLOR;

            if (j === 0) {
                ctx.fillText(`${i}`, j * cellWidth + 5, i * cellHeight + 10);
            }else if (i === 0) {
                ctx.fillText(`${j}`, j * cellWidth + 5, i * cellHeight + 10);
            }
            // ctx.fillText(`${i}, ${j}`, j * cellWidth + 5, i * cellHeight + 10);
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
