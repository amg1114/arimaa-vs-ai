import { Game } from "../../class/Game";
import { disableMenu, enableMenu, showErrorMessage } from "./menu";

/**
 * Handles the click event on a cell within the game canvas.
 *
 * @param event - The mouse event triggered by the click.
 * @param game - The game instance containing the game state and logic.
 * @param canvas - The HTML canvas element representing the game board.
 *
 * This function calculates the cell coordinates based on the click position,
 * retrieves the piece at the clicked cell, and updates the game's active cell.
 * If the clicked cell contains a piece that is not frozen, it enables the menu.
 * If the piece is frozen, it shows an error message. If no piece is found at
 * the clicked cell, it sets the active cell to null.
 */
export function onCellClick(event: MouseEvent, game: Game, canvas: HTMLCanvasElement): void {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const coordinates = game.getCellAt(x, y);

    const piece = game.getPieceAt(coordinates);

    disableMenu();

    if (piece) {
        game.activeCell = piece.position;

        if (!piece.isFreezed(game.board)) {
            enableMenu();
            return;
        }

        showErrorMessage("The piece is frozen");
        return;
    }

    game.activeCell = null;
}

/**
 * Handles the hover event on a game cell.
 *
 * @param event - The mouse event triggered by hovering over the canvas.
 * @param game - The game instance containing the game state and logic.
 * @param canvas - The HTML canvas element representing the game board.
 */
export function onCellHover(event: MouseEvent, game: Game, canvas: HTMLCanvasElement): void {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const coordinates = game.getCellAt(x, y);
    const piece = game.getPieceAt(coordinates);

    if (piece) {
        if (piece.isFreezed(game.board)) {
            canvas.style.cursor = "not-allowed";
            return;
        }

        canvas.style.cursor = "pointer";
        return;
    }
}
