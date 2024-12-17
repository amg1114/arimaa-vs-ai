import { Game } from "../../class/Game";
import { Piece } from "../../class/pieces/Piece";

const pieceValues: { [key: string]: number } = {
    Rabbit: 1,
    Cat: 2,
    Dog: 3,
    Horse: 4,
    Camel: 5,
    Elephant: 6,
};

function evaluatePiece(piece: Piece, game: Game): number {
    const value = pieceValues[piece.name] ** 2 || 0;
    const [x, y] = piece.position;

    // Positional value for central control
    let positionValue = x >= 2 && x <= 5 && y >= 2 && y <= 5 ? 0.5 : 0;

    // penalize pieces that are too close to the one trap and that trap doesn't have friendly pieces around
    const traps = game.getTraps();
    traps.forEach((trap) => {
        const pieceAt = game.getPieceAt(trap);
        if (!pieceAt || pieceAt.color !== piece.color) {
            const distance = Math.abs(trap[0] - x) + Math.abs(trap[1] - y);
            if (distance === 1) {
                const adjacents = piece.getAdjacentsMovements(trap);

                if (
                    !adjacents.some((adjacent) => {
                        const pieceAt = game.getPieceAt(adjacent);
                        return pieceAt && pieceAt.color === piece.color;
                    })
                ) {
                    positionValue -= 0.5;
                }
            }
        }
    });

    // Bonus for Rabbits close to the goal line (depends on color)
    if (piece.name === "Rabbit") {
        positionValue += 0.0001; // Closer to goal gets more value
    }

    // Mobility: Check if the piece is frozen or immobilized
    const isMobile = !piece.isImmobilized();
    const mobilityValue = isMobile ? 0.5 : -0.5; // Bonus for mobility, penalty for being frozen

    return value + mobilityValue + positionValue;
}

export default function evaluateGame(game: Game): number {
    const opponentColor = game.currentPlayer.color === "gold" ? "silver" : "gold";

    const ownPieces = game.getAllPieces(opponentColor);
    const opponentPieces = game.getAllPieces(game.currentPlayer.color);

    let score = 0;

    // Evaluate all pieces for the current player
    ownPieces.forEach((piece) => {
        score += evaluatePiece(piece, game);
    });

    // Evaluate all pieces for the opponent (subtract their value)
    opponentPieces.forEach((piece) => {
        score -= evaluatePiece(piece, game);
    });

    return score;
}
