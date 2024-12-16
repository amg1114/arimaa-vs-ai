import { Game } from "../../class/Game";
import { Piece } from "../../class/pieces/Piece";
import { AvailableMovement } from "../../types/game-movement";

interface MovementSimulation {
    game: Game;
    path: string;
}

// export function simulateAllMovements(game: Game, piece: Piece, path: string = "", depth: number = 0, maxDepth: number = 5): MovementSimulation[] {
//     const availableTypes: AvailableMovement["type"][] = ["simple", "push", "pull"];

//     if (game.currentPlayer.turns === 0 || !piece || depth >= maxDepth)
//         return [
//             {
//                 game: game,
//                 path: path,
//             },
//         ];

//     let paths: MovementSimulation[] = [];

//     availableTypes.forEach((type) => {
//         const cost = type === "simple" ? 1 : 2;
//         const gameCopy = game.clone();
//         const pieceCopy = piece.clone();
//         if (gameCopy.currentPlayer.turns >= cost) {
//             gameCopy.currentPlayer.turns -= cost;

//             const newPath = path ? `${path} -> ${type}` : type;
//             if (type === "simple") {
//                 // paths.push(
//                 //     ...simulateAllMovements(
//                 //         gameCopy,
//                 //         pieceCopy,
//                 //         `${newPath}[${gameCopy.id}]`,
//                 //         depth + 1,
//                 //         maxDepth
//                 //     )
//                 // );

//             } else if (type === "push") {
//                 paths.push(
//                     ...simulateAllMovements(
//                         gameCopy,
//                         pieceCopy,
//                         `${newPath}[${gameCopy.id}]`,
//                         depth + 1,
//                         maxDepth
//                     )
//                 );

//             }
//         }
//     });

//     return paths;
// }

export function simulateAllMovements(
    game: Game,
    piece: Piece,
    color: "gold" | "silver",
    path: string = "",
    depth: number = 0,
    maxDepth: number = 10
): MovementSimulation[] {
    const availableTypes: AvailableMovement["type"][] = ["simple", "push", "pull"];
    // console.log("Simulating All Movements", {
    //     color,
    //     depth,
    //     path,
    //     turns: game.currentPlayer.turns,
    //     playerColor: game.currentPlayer.color,
    // });
    if (game.currentPlayer.turns === 0 || game.currentPlayer.color !== color || depth >= maxDepth) {
        // console.log("Returning");
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

        const pieceCopy = piece.clone();
        try {
        }catch(e) {
            console.log("Error on clone", {
                piece,
                gameHistory: game.history,
                type,
                path,
            });
            console.log(game.getBoardStr());
            return
        }

        if (gameCopy.currentPlayer.turns >= cost) {
            // console.log("Entering with", cost, gameCopy.currentPlayer.turns);
            const turns = gameCopy.currentPlayer.turns;
            let newPath = path ? `${path} -> ${type}` : type;
            newPath += `[${depth}][${turns}]`;

            if (type === "simple") {
                const availableMovements = pieceCopy.getSimpleMovements();
                gameCopy.setAvailableMovements(availableMovements);
                availableMovements.forEach((movement) => {
                    const localGame = gameCopy.clone();
                    const localPiece = localGame.getPieceAt(pieceCopy.position)!;

                    try {
                        localGame.simpleMovement({
                            from: localPiece.position,
                            to: movement.coordinates,
                            player: localGame.currentPlayer,
                        });
    
                    }catch(e) {
                        console.log("Error on simple movement", color, localGame.currentPlayer.color) 
                        console.log(localGame.getBoardStr(), {
                            from: localPiece.position,
                            to: movement.coordinates,
                            // player: localGame.currentPlayer,
                            
                            history: localGame.history
                        });
                        return;
                    }
                    

                    const newPiece = localGame.getPieceAt(movement.coordinates)!;
                    if (!newPiece && localGame.isTrap(movement.coordinates)) {
                        console.warn("Piece is trapped")
                        return;
                    }
                    paths.push(
                        ...simulateAllMovements(
                            localGame,
                            newPiece,
                            color,
                            `${newPath}[${localGame.id}]`,
                            depth + 1,
                            maxDepth
                        )
                    );
                });
            // } else if (type === "push") {
            //     const availableMovements = pieceCopy.getPushablePieces();
            //     gameCopy.setAvailableMovements(availableMovements);

            //     console.log("PRE PUSH", pieceCopy.position, piece.gameId);
            //     console.log(gameCopy.id);
            //     console.log(gameCopy.getBoardStr(pieceCopy.board));
            //     // console.log(gameCopy.getBoardStr());
            //     console.log("Pusheable Pieces", availableMovements)

            //     availableMovements.forEach((movement) => {
            //         const localGame = gameCopy.clone();
            //         const localPiece = localGame.getPieceAt(pieceCopy.position)!;
            //         try {

            //             localGame.pushMovement({
            //                 from: localPiece.position,
            //                 to: movement.coordinates,
            //                 player: localGame.currentPlayer,
            //             });
            //         }catch(e) {
            //             console.log("Error on push movement", color, localGame.currentPlayer.color) 
            //             console.log(localGame.getBoardStr(), {
            //                 from: localPiece.position,
            //                 to: movement.coordinates,
            //                 history: localGame.history
            //             });
            //             return;
            //         }

            //         // console.log("IN PUSH")
            //         // console.log(localGame.getBoardStr());
            //         // console.log("Available Movements", localGame.availableMovements);
                   
            //         localGame.availableMovements.forEach((availableMovement) => {
                    
            //             const subLocalGame = localGame.clone();

            //             subLocalGame.pushPiece({
            //                 to: availableMovement.coordinates,
            //                 player: subLocalGame.currentPlayer,
            //             });
                       
            //             const newPiece = subLocalGame.getPieceAt(movement.coordinates)!;
            //             // console.log("POST PUSH");
                        
            //             // console.log(subLocalGame.getBoardStr());
            //             paths.push(...simulateAllMovements(subLocalGame, newPiece, color, `${newPath}[${subLocalGame.id}]`, depth + 1, maxDepth));
            //         });
            //     });
            }
        }
    });

    return paths;
}
