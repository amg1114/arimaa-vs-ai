import { Game } from "../../class/Game";
import { Piece } from "../../class/pieces/Piece";
import { AvailableMovement } from "../../types/game-movement";

interface MovementSimulation {
    game: Game;
    path: string;
}

export function simulateAllMovements(
    game: Game,
    piece: Piece,
    color: "gold" | "silver",
    path: string = "",
    depth: number = 0,
    maxDepth: number = 100
): MovementSimulation[] {
    const availableTypes: AvailableMovement["type"][] = ["simple", "push", "pull"];

    if (game.currentPlayer.turns === 0 || game.currentPlayer.color !== color) {
        return [
            {
                game: game,
                path: path,
            },
        ];
    }

    let paths: MovementSimulation[] = [];

    availableTypes.forEach((type) => {
        const cost = type === "simple" ? 1 : 2;

        const gameCopy = game.clone();
        const pieceCopy = gameCopy.getPieceAt(piece.position)!;
        pieceCopy.game = gameCopy;

        if (gameCopy.currentPlayer.turns >= cost) {
            const turns = gameCopy.currentPlayer.turns;
            let newPath = path ? `${path} -> ${type}` : type;
            newPath += `[${depth}][${turns}]`;

            if (type === "simple") {
                const availableMovements = pieceCopy.getSimpleMovements();
                gameCopy.setAvailableMovements(availableMovements);
                availableMovements.forEach((movement) => {
                    const localGame = gameCopy.clone();
                    const localPiece = localGame.getPieceAt(pieceCopy.position)!;

                    localGame.simpleMovement({
                        from: localPiece.position,
                        to: movement.coordinates,
                        player: localGame.currentPlayer,
                    });

                    const newPiece = localGame.getPieceAt(movement.coordinates)!;
                    if (!newPiece && localGame.isTrap(movement.coordinates)) {
                        console.warn("Piece is trapped");
                        return;
                    }
                    paths.push(...simulateAllMovements(localGame, newPiece, color, `${newPath}[${localGame.id}]`, depth + 1, maxDepth));
                });
            } else if (type === "push") {
                const availableMovements = pieceCopy.getPushablePieces();
                gameCopy.setAvailableMovements(availableMovements);

                availableMovements.forEach((movement) => {
                    const localGame = gameCopy.clone();
                    const localPiece = localGame.getPieceAt(pieceCopy.position)!;
                    localGame.pushMovement({
                        from: localPiece.position,
                        to: movement.coordinates,
                        player: localGame.currentPlayer,
                    });

                    localGame.availableMovements.forEach((availableMovement) => {
                        const subLocalGame = localGame.clone();
                        subLocalGame.pushPiece({
                            to: availableMovement.coordinates,
                            player: subLocalGame.currentPlayer,
                        });

                        const newPiece = subLocalGame.getPieceAt(movement.coordinates)!;
                        newPiece.game = subLocalGame;

                        paths.push(...simulateAllMovements(subLocalGame, newPiece, color, `${newPath}[${subLocalGame.id}]`, depth + 1, maxDepth));
                    });
                });
            } else {
                const pullablePieces = pieceCopy.getPullablePieces();
                gameCopy.setAvailableMovements(pullablePieces);

                console.log("Pullable pieces");
                console.log(pullablePieces);

                pullablePieces.forEach((movement) => {
                    const localGame = gameCopy.clone();
                    const localPiece = localGame.getPieceAt(pieceCopy.position)!;
                    localPiece.game = localGame;

                    localGame.pullMovement({
                        from: localPiece.position,
                        to: movement.coordinates,
                        player: localGame.currentPlayer,
                    });

                    console.log("Pulling", {
                        from: localPiece.position,
                        to: movement.coordinates,
                        floatingPiece: localGame.floatingPiece,
                    });
                    console.log(localGame.getBoardStr());

                    localGame.availableMovements.forEach((availableMovement) => {
                        const subLocalGame = localGame.clone();

                        subLocalGame.pullPiece({
                            from: localPiece.position,
                            to: availableMovement.coordinates,
                            player: subLocalGame.currentPlayer,
                        });

                        console.log("After pull");
                        console.log(subLocalGame.getBoardStr());

                        const newPiece = subLocalGame.getPieceAt(availableMovement.coordinates)!;

                        if (!newPiece && subLocalGame.isTrap(availableMovement.coordinates)) {
                            return;
                        }
                        
                        newPiece.game = subLocalGame;
                        paths.push(...simulateAllMovements(subLocalGame, newPiece, color, `${newPath}[${subLocalGame.id}]`, depth + 1, maxDepth));
                    });
                });
            }
        }
    });

    return paths;
}
