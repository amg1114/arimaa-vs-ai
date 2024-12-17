import { Game } from "../../class/Game";
import { AvailableMovement, MovementSimulation } from "../../types/game-movement";

function simulateAllMovements(
    game: Game,
    color: "gold" | "silver",
    nodeType: "max" | "min" = "max",
    evaluatedNodes: Set<string> = new Set<string>(),
    path: string = "",
    depth: number = 0,
    maxDepth: number = 5
): MovementSimulation[] {
    const availableTypes: AvailableMovement["type"][] = ["simple", "push", "pull"];
    
    if (game.currentPlayer.turns === 0 || game.currentPlayer.color !== color || depth >= maxDepth) {
        return [
            {
                type: nodeType,
                value: nodeType === "max" ? Infinity : -Infinity,
                game: game,
                path: path,
                key: game.getBoardStr(),
            },
        ];
    }

    let paths: MovementSimulation[] = [];

    if (evaluatedNodes.has(game.getBoardStr())) {
        return [];
    }

    evaluatedNodes.add(game.getBoardStr());

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

                        paths.push(...simulateAllMovements(localGame, color, nodeType, evaluatedNodes, `${newPath}[${localGame.id}]`, depth + 1, maxDepth));
                    });
                } else if (type === "push") {
                    const availableMovements = pieceCopy.getPushablePieces();
                    // console.log("getPushablePieces", availableMovements);
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
                            
                            paths.push(...simulateAllMovements(subLocalGame, color, nodeType, evaluatedNodes, `${newPath}[${subLocalGame.id}]`, depth + 1, maxDepth));
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

                            paths.push(...simulateAllMovements(subLocalGame, color, nodeType, evaluatedNodes, `${newPath}[${subLocalGame.id}]`, depth + 1, maxDepth));
                        });
                    });
                }
            }
        });
    });

    return paths;
}

export function gameSimulation(game: Game, type: "max" | "min"): MovementSimulation[] {
    return simulateAllMovements(game, game.currentPlayer.color, type);;
}
