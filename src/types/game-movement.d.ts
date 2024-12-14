import { Player } from "../class/Player";
import { coordinates } from "./game-board";

export type GameMovement = {
    from: number[];
    to: number[];
    player: Player;
};

export type AvailableMovement = {
    coordinates: coordinates;
    type: "simple" | "push" | "pull";
}

export type PushMovement = Omit<GameMovement, "from">;