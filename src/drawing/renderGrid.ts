import { felt252ToString } from "@/global/utils";
import { MAP_SIZE, MAX_CELL_SIZE } from "@/global/constants";
import { getGameStore } from "@/global/game.store";
import { createCamera } from "./camera";

type TDrawContext = {
    canvas: HTMLCanvasElement;
    grid: Map<string, TPixel>;
    camera: ReturnType<typeof createCamera>;
};

export type TPixel = {
    position: [number, number];
    color: string;
    text: string;
    needsAttention?: boolean;
};

// const DrawPixelText = (context: TDrawContext, pixel: TPixel) => {
//   const {ctx, pixelSize} = context;
//   ctx.textAlign = 'center'
//   ctx.font=`${(pixelSize / 2)}px Serif`
//   let text = felt252ToString(pixel.text);
//   if (pixel.color === '#000000') ctx.fillStyle = 'white'
//   else ctx.fillStyle = 'black'
//   if (text.includes('U+')) {
//       text = text.replace('U+', '')
//       const codePoint = parseInt(text, 16)
//       text = String.fromCodePoint(codePoint)
//   } else {
//     // FIXME: make this scale better
//     if (text.length > 4 && text.length <= 8) {
//       ctx.font = `${(pixelSize / 4)}px Serif`
//     } else if (text.length > 8 && text.length <= 12) {
//       ctx.font = `${(pixelSize / 6)}px Serif`
//     } else if (text.length > 12) {
//       ctx.font = `${(pixelSize / 8)}px Serif`
//     }
//   }
//   ctx.fillText(text, pixel.position.x + pixelSize / 2, pixel.position.y + pixelSize / 1.5)
// }

// const DrawPixel = (context: TDrawContext, pixel?: TPixel) => {
//   const {ctx, pixelSize} = context;
//   const {position: {x, y}} = pixel;
//   ctx.fillStyle = pixel.color
//   ctx.fillRect(x, y, pixelSize, pixelSize)
//   ctx.strokeStyle = '#2E0A3E'
//   ctx.strokeRect(x, y, pixelSize, pixelSize)

//   if(pixel.needsAttention){
//       ctx.strokeStyle = '#FFFFFF'
//       ctx.shadowColor = '#FFFFFF'
//       ctx.shadowBlur = 10
//       ctx.strokeRect(x, y, pixelSize, pixelSize)
//       ctx.shadowColor = 'transparent'
//   }
// }

// const DrawGridCell = (context: TDrawContext, position: Vector2) => {
//   ctx.fillStyle = pixelColor
//   ctx.fillRect(x, y, cellSize, cellSize)
//   ctx.strokeStyle = '#2E0A3E'
//   ctx.strokeRect(x, y, cellSize, cellSize)
// }

const defaultColor = "#2F1643";
// const offScreenCanvas = document.createElement("canvas");

// TODO: this is template for eventual use of an offscreen renderer so we don't have to draw all the empty tiles individually but can copy them from the offscreen canvas
// const createFillPattern = (ctx: CanvasRenderingContext2D, color: string) => {
//     const cellSize = MAX_CELL_SIZE * (cameraPosition.z / 100);
//     offScreenCanvas.width = cellSize-0.5;
//     offScreenCanvas.height = cellSize-0.5;
//     const offScreenCtx = offScreenCanvas.getContext("2d", { willReadFrequently: true });
//     if (!offScreenCtx) {
//         throw new Error("offscreen canvas not supported");
//     }
//     offScreenCtx.clearRect(0, 0, cellSize, cellSize);
//     offScreenCtx.fillStyle = defaultColor;
//     offScreenCtx.fillRect(0.5, 0.5, cellSize-0.5, cellSize-0.5);
//     offScreenCtx.strokeStyle = "#2E0A3E";
//     offScreenCtx.strokeRect(0.5, 0.5, cellSize-0.5, cellSize-0.5);
//     return offScreenCtx.canvas;
// }

export const renderGrid = ({ canvas, grid, camera }: TDrawContext) => {
    const { width, height } = canvas;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx || !camera) return;
    const cameraPosition = camera.getPosition();
    const cellSize = MAX_CELL_SIZE * (cameraPosition.z / 100);
    const focus = getGameStore().notificationData ? [getGameStore().notificationData] : [];
    const selectedHexColor = getGameStore().selectedHexColor;
    const hoveredPixel = getGameStore().hoveredPixel;

    const bounds = camera.calculateViewport();
    ctx.clearRect(0, 0, width, height);

    const start = {
        x: Math.floor(bounds.x),
        y: Math.floor(bounds.y),
    };
    const end = {
        x: Math.floor(bounds.z),
        y: Math.floor(bounds.w),
    };

    // const pattern = createFillPattern(ctx, selectedHexColor);

    for (let row = start.x; row <= end.x; row++) {
        for (let col = start.y; col <= end.y; col++) {
            if (row < 0 || col < 0 || row >= MAP_SIZE || col >= MAP_SIZE) continue;
            const x = row * cellSize + cameraPosition.x;
            const y = col * cellSize + cameraPosition.y;

            let pixelColor = defaultColor; // default color
            let pixelText = "";
            const isHovered = hoveredPixel && row === hoveredPixel.x && col === hoveredPixel.y;
            const pixel = grid.get(`[${row},${col}]`) || undefined;
            if (pixel) {
                /// if hexColor from the contract is empty, then use default color
                pixel.color = pixel.color === "0x0" ? pixelColor : pixel.color;
                // Get the current color of the pixel
                if (pixel.text && pixel.text !== "0x0") {
                    pixelText = pixel.text;
                }
                pixelColor = pixel.color;
            }

            if (isHovered) {
                pixelColor = selectedHexColor;
            }

            if (pixel || (!pixel && cameraPosition.z > 9) || isHovered) {
                ctx.fillStyle = pixelColor;
                ctx.fillRect(x, y, cellSize, cellSize);
                ctx.strokeStyle = "#2E0A3E";
                ctx.strokeRect(x, y, cellSize, cellSize);
            }
            // } else {
            //     ctx.drawImage(pattern, x, y, cellSize, cellSize);
            // }

            if (focus.length) {
                // const pixelNeedAttention = focus.find(p => p.x === row && p.y === col)
                // if(pixelNeedAttention){
                //   ctx.strokeStyle = '#FFFFFF'
                //   ctx.shadowColor = '#FFFFFF'
                //   ctx.shadowBlur = 10
                //   ctx.strokeRect(x, y, cellSize, cellSize)
                //   ctx.shadowColor = 'transparent'
                // }
            }

            if (pixelText) {
                ctx.textAlign = "center";

                ctx.font = `${cellSize / 2}px Serif`;

                let text = felt252ToString(pixelText);

                if (pixelColor === "#000000") ctx.fillStyle = "white";
                else ctx.fillStyle = "black";

                if (text.includes("U+")) {
                    text = text.replace("U+", "");
                    const codePoint = parseInt(text, 16);
                    text = String.fromCodePoint(codePoint);
                } else {
                    // FIXME: make this scale better
                    if (text.length > 4 && text.length <= 8) {
                        ctx.font = `${cellSize / 4}px Serif`;
                    } else if (text.length > 8 && text.length <= 12) {
                        ctx.font = `${cellSize / 6}px Serif`;
                    } else if (text.length > 12) {
                        ctx.font = `${cellSize / 8}px Serif`;
                    }
                }

                ctx.fillText(text, x + cellSize / 2, y + cellSize / 1.5);
            }
        }
    }
};
