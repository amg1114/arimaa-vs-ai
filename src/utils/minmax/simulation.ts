import { Game } from "../../class/Game";
import { AvailableMovement, MovementSimulation } from "../../types/game-movement";

function simulateAllMovements(
    game: Game,
    color: "gold" | "silver",
    nodeType: "max" | "min" = "max",
    path: string = "",
    depth: number = 0,
    maxDepth: number = 10
): MovementSimulation[] {
    const availableTypes: AvailableMovement["type"][] = ["pull"];

    if (game.currentPlayer.turns === 0 || game.currentPlayer.color !== color || depth >= maxDepth || game.checkGameEnd()) {
        return [
            {
                type: nodeType,
                value: null,
                game: game,
                path: path,
                key: game.getBoardStr(),
            },
        ];
    }

    let paths: MovementSimulation[] = [];

    game.getAllPieces(color).forEach((piece) => {
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
                    // console.log("availableMovements", availableMovements);
                    availableMovements.forEach((movement) => {
                        const localGame = gameCopy.clone();
                        const localPiece = localGame.getPieceAt(pieceCopy.position)!;

                        localGame.simpleMovement({
                            from: localPiece.position,
                            to: movement.coordinates,
                            player: localGame.currentPlayer,
                            type: "simple",
                        });

                        paths.push(...simulateAllMovements(localGame, color, nodeType, `${newPath}[${localGame.id}]`, depth + 1, maxDepth));
                    });
                } else if (type === "push") {
                    const availableMovements = pieceCopy.getPushablePieces();
                    console.log("getPushablePieces", availableMovements);
                    gameCopy.setAvailableMovements(availableMovements);

                    availableMovements.forEach((movement) => {
                        const localGame = gameCopy.clone();
                        const localPiece = localGame.getPieceAt(pieceCopy.position)!;
                        localGame.pushMovement({
                            from: localPiece.position,
                            to: movement.coordinates,
                            player: localGame.currentPlayer,
                            type: "pre-push",
                        });

                        localGame.availableMovements.forEach((availableMovement) => {
                            const subLocalGame = localGame.clone();
                            subLocalGame.pushPiece({
                                to: availableMovement.coordinates,
                                player: subLocalGame.currentPlayer,
                                type: "push",
                            });

                            const newPiece = subLocalGame.getPieceAt(movement.coordinates)!;

                            newPiece.game = subLocalGame;
                            paths.push(...simulateAllMovements(subLocalGame, color, nodeType, `${newPath}[${subLocalGame.id}]`, depth + 1, maxDepth));
                        });
                    });
                } else {
                    const pullablePieces = pieceCopy.getPullablePieces();
                    // console.log("getPullablePieces", pullablePieces);
                    gameCopy.setAvailableMovements(pullablePieces);

                    pullablePieces.forEach((movement) => {
                        const localGame = gameCopy.clone();
                        const localPiece = localGame.getPieceAt(pieceCopy.position)!;
                        localPiece.game = localGame;

                        localGame.pullMovement({
                            from: localPiece.position,
                            to: movement.coordinates,
                            player: localGame.currentPlayer,
                            type: "pre-pull",
                        });

                        localGame.availableMovements.forEach((availableMovement) => {
                            const subLocalGame = localGame.clone();

                            subLocalGame.pullPiece({
                                from: localPiece.position,
                                to: availableMovement.coordinates,
                                player: subLocalGame.currentPlayer,
                                type: "pull",
                            });

                            const newPiece = subLocalGame.getPieceAt(availableMovement.coordinates)!;

                            newPiece.game = subLocalGame;
                            paths.push(...simulateAllMovements(subLocalGame, color, nodeType, `${newPath}[${subLocalGame.id}]`, depth + 1, maxDepth));
                        });
                    });
                }
            }
        });
    });

    return paths;
}

export function gameSimulation(game: Game, type: "max" | "min"): MovementSimulation[] {
    const evaluatedNodes = new Set<string>();
    const nodes = simulateAllMovements(game, game.currentPlayer.color, type);

    const uniques = nodes.filter((node) => {
        if (evaluatedNodes.has(node.key)) {
            return false;
        }

        evaluatedNodes.add(node.key);
        return true;
    });
    return uniques;
}
