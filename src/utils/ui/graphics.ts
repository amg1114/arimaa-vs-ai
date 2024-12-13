import { coordinates } from "../../types/game-board";

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