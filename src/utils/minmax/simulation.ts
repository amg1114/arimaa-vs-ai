import { Game } from "../../class/Game";
import { AvailableMovement, GameMovement, MovementSimulation } from "../../types/game-movement";

function simulateAllMovements(
    game: Game,
    color: "gold" | "silver",
    nodeType: "max" | "min" = "max",
    path: string = "",
    depth: number = 0,
    maxDepth: number = 10,
): MovementSimulation[] {
    const availableTypes: AvailableMovement["type"][] = ["simple"];

    if (game.currentPlayer.turns === 0 || game.currentPlayer.color !== color || depth >= maxDepth) {
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

                    availableMovements.forEach((movement) => {
                        const localGame = gameCopy.clone();
                        const localPiece = localGame.getPieceAt(pieceCopy.position)!;

                        localGame.simpleMovement({
                            from: localPiece.position,
                            to: movement.coordinates,
                            player: localGame.currentPlayer,
                        });

                        const newPiece = localGame.getPieceAt(movement.coordinates)!;
                        const lastMovement = localGame.history[localGame.history.length - 1];
                        const isAtBack = (lastMovement as GameMovement)?.from === movement.coordinates;

                        if ((!newPiece && localGame.isTrap(movement.coordinates)) || isAtBack) {
                            paths.push({
                                type: nodeType,
                                value: null,
                                game: localGame,
                                path: newPath,
                                key: localGame.getBoardStr(),
                            });
                            return;
                        }

                        paths.push(...simulateAllMovements(localGame, color, nodeType, `${newPath}[${localGame.id}]`, depth + 1, maxDepth));
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

                            if (!newPiece && subLocalGame.isTrap(movement.coordinates)) {
                                paths.push({
                                    type: nodeType,
                                    value: null,
                                    game: subLocalGame,
                                    path: newPath,
                                    key: subLocalGame.getBoardStr(),
                                });

                                return;
                            }

                            newPiece.game = subLocalGame;
                            paths.push(...simulateAllMovements(subLocalGame, color, nodeType, `${newPath}[${subLocalGame.id}]`, depth + 1, maxDepth));
                        });
                    });
                } else {
                    const pullablePieces = pieceCopy.getPullablePieces();
                    gameCopy.setAvailableMovements(pullablePieces);

                    pullablePieces.forEach((movement) => {
                        const localGame = gameCopy.clone();
                        const localPiece = localGame.getPieceAt(pieceCopy.position)!;
                        localPiece.game = localGame;

                        localGame.pullMovement({
                            from: localPiece.position,
                            to: movement.coordinates,
                            player: localGame.currentPlayer,
                        });

                        localGame.availableMovements.forEach((availableMovement) => {
                            const subLocalGame = localGame.clone();

                            subLocalGame.pullPiece({
                                from: localPiece.position,
                                to: availableMovement.coordinates,
                                player: subLocalGame.currentPlayer,
                            });

                            const newPiece = subLocalGame.getPieceAt(availableMovement.coordinates)!;

                            if (!newPiece && subLocalGame.isTrap(availableMovement.coordinates)) {
                                paths.push({
                                    type: nodeType,
                                    value: null,
                                    game: subLocalGame,
                                    path: newPath,
                                    key: subLocalGame.getBoardStr(),
                                });
                                return;
                            }

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
    })
    return uniques;
}
