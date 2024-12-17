import { Game } from "../../class/Game";
import { MovementSimulation } from "../../types/game-movement";
import evaluateGame from "./heuristicas";
import { gameSimulation } from "./simulation";

export function buildMinMaxTree(game: Game, color: "gold" | "silver", isMax = true, depth = 0, maxDepth = 3): MovementSimulation[] {
    if (depth >= maxDepth) {
        const evaluation = evaluateGame(game, game.currentPlayer);
        return [
            {
                type: isMax ? "max" : "min",
                value: evaluation,
                game: game,
                path: "",
                key: game.getBoardStr(),
            },
        ];
    }

    const type = isMax ? "max" : "min";
    const nodes = gameSimulation(game, type);

    console.log(`Depth: ${depth} - Nodes: ${nodes.length}`);

    return nodes.map((node) => {
        const children = buildMinMaxTree(node.game, color, !isMax, depth + 1, maxDepth);
        return {
            ...node,
            children,
        };
    });
}
