import { Game } from "../../class/Game";
import { MovementSimulation } from "../../types/game-movement";
import evaluateGame from "./heuristicas";
import { gameSimulation } from "./simulation";


export function minimax(node: MovementSimulation, isMaximizing: boolean): MovementSimulation {
    // Si el nodo es hoja, devolvemos el nodo actual
    if (!node.children || node.children.length === 0) {
        if (node.value === null) {
            throw new Error(`Leaf node must have a value. Path: ${node.path}`);
        }
        return node; // Nodo hoja
    }

    let bestNode: MovementSimulation | null = null;

    if (isMaximizing) {
        let maxValue = -Infinity;
        for (const child of node.children) {
            const candidateNode = minimax(child, child.type === "max");
            if (candidateNode.value !== null && candidateNode.value > maxValue) {
                maxValue = candidateNode.value;
                bestNode = candidateNode;
            }
        }
        node.value = maxValue; // Actualizamos el valor del nodo padre
    } else {
        let minValue = Infinity;
        for (const child of node.children) {
            const candidateNode = minimax(child, child.type === "max");
            if (candidateNode.value !== null && candidateNode.value < minValue) {
                minValue = candidateNode.value;
                bestNode = candidateNode;
            }
        }
        node.value = minValue; // Actualizamos el valor del nodo padre
    }

    // Validamos que se haya encontrado un nodo óptimo
    if (!bestNode) {
        throw new Error(`No valid child nodes found for node at path: ${node.path}`);
    }

    return bestNode;
}

export function buildMinMaxTree(game: Game) {
    const tree: MovementSimulation = {
        type: "max",
        value: null,
        game: game,
        children: getMinMaxTree(game, false),
        key: game.id,
        path: "",
    };

    return tree;
}

export function getMinMaxTree(game: Game, isMax = true, depth = 0, maxDepth = 2): MovementSimulation[] {
    if (depth >= maxDepth || game.checkGameEnd()) {
        const evaluation = evaluateGame(game, game.currentPlayer);

        const node: MovementSimulation = {
            type: isMax ? "max" : "min",
            value: evaluation,
            game: game,
            path: "",
            key: game.getBoardStr(),
            color: game.currentPlayer.color,
        };

        return [node];
    }

    const type = isMax ? "max" : "min";
    const nodes = gameSimulation(game, type);

    //console.log(`Depth: ${depth} - Nodes: ${nodes.length}`);

    return nodes.map((node) => {
        const children = getMinMaxTree(node.game, !isMax, depth + 1, maxDepth);
        return {
            ...node,
            children,
        };
    });
}
