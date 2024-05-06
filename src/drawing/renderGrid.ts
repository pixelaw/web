import { MutableRefObject, useCallback } from "react";
import { felt252ToString } from "@/global/utils";
import { Vector2 } from "threejs-math";
import { CANVAS_HEIGHT, CANVAS_WIDTH, MAP_SIZE, MAX_CELL_SIZE } from "@/global/constants";
import { getGameStore } from "@/global/game.store";

type TDrawContext = {
    canvas: HTMLCanvasElement;
    grid: Map<string, TPixel>;
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

const calculateVisibleArea = (panOffset: Vector2) => {
    const cellSize = MAX_CELL_SIZE * (getGameStore().zoomLevel.x / 100);
    let visibleAreaXStart = Math.max(0, Math.floor(-panOffset.x / cellSize));
    let visibleAreaYStart = Math.max(0, Math.floor(-panOffset.y / cellSize));
    let visibleAreaXEnd = Math.min(MAP_SIZE, Math.ceil((CANVAS_WIDTH - panOffset.x) / cellSize));
    let visibleAreaYEnd = Math.min(MAP_SIZE, Math.ceil((CANVAS_HEIGHT - panOffset.y) / cellSize));
    const bufferArea = 10;
    const minLimit = 0,
        maxLimit = MAP_SIZE;

    const expandedMinX = visibleAreaXStart - bufferArea;
    const expandedMinY = visibleAreaYStart - bufferArea;

    const expandedMaxX = visibleAreaXEnd + bufferArea;
    const expandedMaxY = visibleAreaYEnd + bufferArea;

    visibleAreaXStart = expandedMinX < minLimit ? minLimit : expandedMinX;
    visibleAreaYStart = expandedMinX < minLimit ? minLimit : expandedMinY;

    visibleAreaXEnd = expandedMaxX > maxLimit ? maxLimit : expandedMaxX;
    visibleAreaYEnd = expandedMaxY > maxLimit ? maxLimit : expandedMaxY;

    const viewStart = new Vector2(visibleAreaXStart, visibleAreaYStart);
    const viewEnd = new Vector2(visibleAreaXEnd, visibleAreaYEnd);

    return { viewStart, viewEnd };
};

// export setupRenderer = () => {
//     const offScreenCanvas = document.createElement("canvas");
//     offScreenCanvas.width = CANVAS_WIDTH;
//     offScreenCanvas.height = CANVAS_HEIGHT;
//     const offScreenCtx = offScreenCanvas.getContext("2d", { willReadFrequently: true });
//     if (!offScreenCtx) return;
//     return offScreenCtx;
// }

export const renderGrid = ({ canvas, grid }: TDrawContext) => {
    const { width, height } = canvas;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    const cellSize = MAX_CELL_SIZE * (getGameStore().zoomLevel.x / 100);
    const panOffset = getGameStore().panOffset;
    const focus = getGameStore().notificationData ? [getGameStore().notificationData] : [];
    const selectedHexColor = getGameStore().selectedHexColor;
    const hoveredPixel = getGameStore().hoveredPixel;

    const { viewStart, viewEnd } = calculateVisibleArea(panOffset);
    ctx.clearRect(0, 0, width, height);

    const start = {
        x: Math.floor(viewStart.x),
        y: Math.floor(viewStart.y),
    };
    const end = {
        x: Math.floor(viewEnd.x),
        y: Math.floor(viewEnd.y),
    };

    for (let row = start.x; row <= end.x; row++) {
        for (let col = start.y; col <= end.y; col++) {
            const x = row * cellSize + panOffset.x;
            const y = col * cellSize + panOffset.y;

            let pixelColor = "#2F1643"; // default color
            let pixelText = "";

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

            if (hoveredPixel && row === hoveredPixel.x && col === hoveredPixel.y) {
                pixelColor = selectedHexColor;
            }

            ctx.fillStyle = pixelColor;
            ctx.fillRect(x, y, cellSize, cellSize);
            ctx.strokeStyle = "#2E0A3E";
            ctx.strokeRect(x, y, cellSize, cellSize);

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
