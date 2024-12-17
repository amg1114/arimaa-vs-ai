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

function evaluatePiece(piece: Piece): number {
    const value = pieceValues[piece.name] ** 2 || 0;
    const [x, y] = piece.position;

    // Positional value for central control
    let positionValue = x >= 2 && x <= 5 && y >= 2 && y <= 5 ? 0.5 : 0;

    if (piece.name === "Rabbit") {
        const goalRow = piece.color === "gold" ? 0 : 7;
        const distanceToGoal = Math.abs(goalRow - x);
        positionValue += (7 - distanceToGoal) * 0.1; // Closer to goal gets more value
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
        score += evaluatePiece(piece);
    });

    // Evaluate all pieces for the opponent (subtract their value)
    opponentPieces.forEach((piece) => {
        score -= evaluatePiece(piece);
    });

    return score;
}
