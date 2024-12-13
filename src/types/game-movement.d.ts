import { Player } from "../class/Player";

export type GameMovement = {
    from: number[];
    to: number[];
    player: Player;
};

export type PushMovement = Omit<GameMovement, "from">;