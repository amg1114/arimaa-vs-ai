import { Game } from "../../class/Game";
import { coordinates } from "../../types/game-board";
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
    const offset = parseOffsetToCoordinates(event, canvas);
    const coordinates = game.getCellAt(offset[0], offset[1]);

    const piece = game.getPieceAt(coordinates);

    disableMenu();

    if (piece) {
        if(piece.color !== game.currentPlayer.color) {
            showErrorMessage("You can only move your own pieces");
            return;
        }

        game.activeCell = piece.position;

        if (!piece.isFreezed()) {
            enableMenu();
            return;
        }

        showErrorMessage("The piece is frozen");
        return;
    }
    if (!game.isMoving) {
        game.activeCell = null;
        
    }
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

    if(game.isMoving === "push" && game.floatingPiece) {
        canvas.style.cursor = "grabbing";
        return;
    }

    if (piece) {
        if (piece.isFreezed() || piece.color !== game.currentPlayer.color) {
            canvas.style.cursor = "not-allowed";
            return;
        }

        canvas.style.cursor = "pointer";
        return;
    }

    canvas.style.cursor = "default";
}


/**
 * Parses the offset of a mouse event to canvas coordinates.
 *
 * @param event - The mouse event containing the offset.
 * @param canvas - The canvas element to calculate the coordinates relative to.
 * @returns An array containing the x and y coordinates relative to the canvas.
 */
export function parseOffsetToCoordinates(event: MouseEvent, canvas: HTMLCanvasElement): coordinates {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    return [x, y];
}