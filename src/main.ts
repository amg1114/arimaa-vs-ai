import "./style.css";

declare global {
    interface Window {
        game: Game;
        playerA: Player
    }
}

import { Game } from "./class/Game.ts";
import { Piece } from "./class/pieces/Piece.ts";
import { Player } from "./class/Player.ts";

// document ready
var game = new Game();

window.game = game;
window.playerA = new Player("silver");

const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
const ctx = canvas.getContext("2d")!;

// Ajustar el tamaño del canvas para alta resolución
canvas.width = 600;
canvas.height = 600;
// ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

game.fillBoard();

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
          
            const height = canvasHeight / game.board.length;
            const width = canvasWidth / game.board[i].length;
            
           // add index to tile
           ctx.font = "10px Arial";
           ctx.fillStyle = "black";
           ctx.fillText(`${i}, ${j}`, j * width + 5, i * height + 10);

            if (game.board[i][j] instanceof Piece) {
                const piece = game.board[i][j] as Piece;
                const image = new Image();

                image.src = `/pieces/${piece.color.toLowerCase()}/${piece.name.toLocaleLowerCase()}.svg`;


                ctx.drawImage(image, j * width, i * height, width, height);
            } else {
                const tile = game.board[i][j] as number;

                if (tile === 1) {
                    ctx.fillStyle = "gray";
                    ctx.fillRect(j * width, i * height, width, height);
                }
            }

           
        }
    }
}

gameLoop();