import "./style.css";

declare global {
    interface Window {
        game: Game;
        playerA: Player;
    }
}

import { Game } from "./class/Game.ts";
import { Piece } from "./class/pieces/Piece.ts";
import { Player } from "./class/Player.ts";
import { disableMenu, enableMenu, showErrorMessage } from "./utils/ui/menu.ts";

// document ready
var game = new Game();

window.game = game;
window.playerA = new Player("silver");

const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
const ctx = canvas.getContext("2d")!;

// Ajustar el tamaño del canvas para alta resolución
canvas.width = 600;
canvas.height = 600;

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

const cellHeight = canvasHeight / game.board.length;
const cellWidth = canvasWidth / game.board[0].length;

game.fillBoard();

canvas.addEventListener("click", (event: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const col = Math.floor(x / cellWidth);
    const row = Math.floor(y / cellHeight);
    const piece = game.getPieceAt([row, col]);

    disableMenu();

    if (piece) {
        game.activeCell = piece.position;

        if (!piece.isFreezed(game.board)) {
            enableMenu();
            return;
        }

        showErrorMessage("The piece is frozen");
        return;
    }

    game.activeCell = null;
});

function gameLoop() {
    drawBoard();

    requestAnimationFrame(gameLoop);
}

function drawBoard() {
    // clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // draw board
    for (let i = 0; i < game.board.length; i++) {
        for (let j = 0; j < game.board[i].length; j++) {
            // add index to tile
            ctx.font = "10px Arial";
            ctx.fillStyle = "white";

            ctx.fillText(`${i}, ${j}`, j * cellWidth + 5, i * cellHeight + 10);

            if (game.board[i][j] instanceof Piece) {
                const piece = game.board[i][j] as Piece;
                const image = new Image();

                image.src = `/pieces/${piece.color.toLowerCase()}/${piece.name.toLocaleLowerCase()}.svg`;

                if (game.activeCell && game.activeCell[0] === piece.position[0] && game.activeCell[1] === piece.position[1]) {
                    ctx.fillStyle = "blue";
                    ctx.fillRect(j * cellWidth, i * cellHeight, cellWidth, cellHeight);
                }

                ctx.drawImage(image, j * cellWidth, i * cellHeight, cellWidth, cellHeight);
            } else {
                const tile = game.board[i][j] as number;

                if (tile === 1) {
                    ctx.fillStyle = "gray";
                    ctx.fillRect(j * cellWidth, i * cellHeight, cellWidth, cellHeight);
                }
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    disableMenu();
});

gameLoop();
