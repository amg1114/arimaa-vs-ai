import { coordinates } from "../../types/game-board";

export const WHITE_CELL_COLOR = "#fffcf2";
export const BLACK_CELL_COLOR = "#ffdc85";
export const TRAP_CELL_COLOR = "#DE3C4B";
export const CELL_TEXT_COLOR = "#38302e";
export const SELECTED_CELL_COLOR = "#1269B5";
/**
 * Draws an image onto a canvas.
 *
 * @param ctx - The canvas rendering context where the image will be drawn.
 * @param image - The source URL of the image to be drawn.
 * @param coordinates - The [x, y] coordinates where the image will be placed on the canvas.
 * @param width - The width of the image to be drawn.
 * @param height - The height of the image to be drawn.
 */
export function drawImage(ctx: CanvasRenderingContext2D, image: string, coordinates: coordinates, width: number, height: number) {
    const [x, y] = coordinates;
    const img = new Image();
    img.src = image;
    ctx.drawImage(img, x, y, width, height);
}

export function drawCell(ctx: CanvasRenderingContext2D, coordinates: coordinates, width: number, height: number, color: string) {
    const [x, y] = coordinates;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

export function drawSelectedCell(ctx: CanvasRenderingContext2D, coordinates: coordinates, width: number, height: number) {
    const [x, y] = coordinates;
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = SELECTED_CELL_COLOR;
    ctx.rect(x, y, width, height);
    ctx.stroke();

    ctx.closePath();
}
