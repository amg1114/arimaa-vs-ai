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
import { pullMovementButton, pushMovementButton, simpleMovementButton, disableMenu, showErrorMessage, hideErrorMessage } from "./utils/ui/menu.ts";
import { onCellClick, onCellHover, parseOffsetToCoordinates } from "./utils/ui/events.ts";

const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
const ctx = canvas.getContext("2d")!;

// Ajustar el tamaño del canvas para alta resolución
const canvasWidth = 600;
const canvasHeight = 600;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

// document ready
var game = new Game(canvasHeight, canvasWidth);

const cellHeight = game.cellHeight;
const cellWidth = game.cellWidth;

window.game = game;
window.playerA = new Player("silver");

game.fillBoard();

canvas.addEventListener("click", (event: MouseEvent) => {
    const offset = parseOffsetToCoordinates(event, canvas);
    const cell = game.getCellAt(offset[0], offset[1]);

    hideErrorMessage();

    if (game.availableMovements.length){
        if(game.availableMovements.some((movement) => movement[0] === cell[0] && movement[1] === cell[1])){
            console.log("Move piece");
            return;
        }

        showErrorMessage("Invalid movement");
        return;
    }

    onCellClick(event, game, canvas);

});
canvas.addEventListener("mousemove", (event: MouseEvent) => onCellHover(event, game, canvas));

simpleMovementButton.addEventListener("click", () => {
    const piece = game.getPieceAt(game.activeCell!);

    if (piece) {
        const movements = piece.getAvailableMovements(game.board);
        game.setAvailableMovements(movements);
        // console.log(game.availableMovements);
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
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // draw board
    for (let i = 0; i < game.board.length; i++) {
        for (let j = 0; j < game.board[i].length; j++) {
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

                if (game.availableMovements.some((movement) => movement[0] === i && movement[1] === j)) {
                    ctx.fillStyle = "green";
                    ctx.fillRect(j * cellWidth, i * cellHeight, cellWidth, cellHeight);
                }
            }

            // add index to tile
            ctx.font = "10px Arial";
            ctx.fillStyle = "white";

            ctx.fillText(`${i}, ${j}`, j * cellWidth + 5, i * cellHeight + 10);
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    disableMenu();
});

gameLoop();
