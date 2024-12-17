import { Game } from "../../class/Game";
import { Player } from "../../class/Player";

export default function evaluateGame(game: Game, player: Player): number {
    const pieces = game.getAllPieces(player.color);

    let rabbitsCount = 0;
    let inmobilizedPieces = 0;
    let playablePieces = 0;
    let piecesWeight = 0;
    let trappedPieces = 0; 
    pieces.forEach((piece) => {
        if (piece.name === "Rabbit") {
            rabbitsCount++;
        }

        if (piece.isImmobilized()) {
            inmobilizedPieces--;
        } else {
            playablePieces++;
        }

        game.getTraps().forEach((trap) => {
            const distance = manhattanDistance(piece.position, trap);
            if (distance < 2) {
                if(game.getPieceAt([trap[0] + 1, trap[1]])?.color === player.color)  return;
                if(game.getPieceAt([trap[0] - 1, trap[1]])?.color === player.color)  return;
                if(game.getPieceAt([trap[0], trap[1]+1])?.color === player.color)  return;
                if(game.getPieceAt([trap[0], trap[1]-1])?.color === player.color)  return;

                trappedPieces++;
            }
        });

        piecesWeight += piece.weight;
    });

    return rabbitsCount + playablePieces - inmobilizedPieces ** 2 - trappedPieces ** 2 + piecesWeight;
}

function manhattanDistance(from: number[], to: number[]): number {
    return Math.abs(from[0] - to[0]) + Math.abs(from[1] - to[1]);
}
