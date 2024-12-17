import { Player } from "../class/Player";
import { coordinates } from "./game-board";

export type GameMovement = {
    from: number[];
    to: number[];
    player: Player;
    turns?: number;
};

export type AvailableMovement = {
    coordinates: coordinates;
    type: "simple" | "push" | "pull";
}

export type PushMovement = Omit<GameMovement, "from">;


export interface MovementSimulation {
    type: "max" | "min";
    children?: MovementSimulation[];
    value: number | null = null;
    game: Game;
    path: string;
    key: string;
    gcolor?: "gold" | "silver";
    color?: "gold" | "silver";
}
