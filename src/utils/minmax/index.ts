import { Game } from "../../class/Game"
import { MovementSimulation } from "../../types/game-movement";
import { gameSimulation } from "./simulation"

export function buildMinMaxTree(game: Game, color: "gold" | "silver", isMax = true, depth = 0, maxDepth = 3): MovementSimulation[] {
    if (depth >= maxDepth) {
        return [];
    }

    const type = isMax ? "max" : "min";
    const nodes = gameSimulation(game, type);
    
    console.log(`Depth: ${depth} - Nodes: ${nodes.length}`);

    nodes.forEach((node) => {
        return buildMinMaxTree(node.game, color, !isMax, depth + 1, maxDepth);
    })

    return nodes;
}