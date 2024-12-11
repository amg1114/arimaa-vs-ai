import { Player } from "../class/Player";

export type GameMovement = {
    from: number[] | null;
    to: number[];
    player: Player;
};