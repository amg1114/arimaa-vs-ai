import './style.css'

import { Game } from './class/Game.ts'
import { Piece } from './class/pieces/Piece.ts'

// document ready 
var game = new Game();

const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!;
const ctx = canvas.getContext('2d')!;

game.fillBoard();

function gameLoop() {
  drawBoard();

  requestAnimationFrame(gameLoop);
}

function drawBoard() {
  for (let i = 0; i < game.board.length; i++) {
    for (let j = 0; j < game.board[i].length; j++) {
      const height = canvas.height / game.board.length;
      const width = canvas.width / game.board[i].length;

      if (game.board[i][j] instanceof Piece) {
        const piece = game.board[i][j] as Piece;
        ctx.fillStyle = piece.color;
        

        ctx.fillRect(piece.position[1] * width, piece.position[0] * height, width, height);
      }
    }
  }

}

gameLoop();
