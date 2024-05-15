import { felt252ToString } from "@/global/utils";
import { getGameStore } from "@/global/game.store";
import { createCamera } from "./camera";
import { Vector2 } from "threejs-math";
import { MAP_SIZE, MAX_CELL_SIZE } from "@/global/constants.drawing";

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
const offScreenCanvas = document.createElement("canvas");

// TODO: this is template for eventual use of an offscreen renderer so we don't have to draw all the empty tiles individually but can copy them from the offscreen canvas
// const createFillPattern = (camera: ReturnType<typeof createCamera>) => {
//     const cameraPosition = camera.getPosition();
//     const cellSize = MAX_CELL_SIZE * (cameraPosition.z / 100);
//     offScreenCanvas.width = cellSize-0.5;
//     offScreenCanvas.height = cellSize-0.5;
//     const offScreenCtx = offScreenCanvas.getContext("2d", { willReadFrequently: true });
//     if (!offScreenCtx) {
//         throw new Error("offscreen canvas not supported");
//     }
//     const bleed = 0.25;

//     offScreenCtx.clearRect(0, 0, cellSize, cellSize);
//     offScreenCtx.fillStyle = defaultColor;
//     offScreenCtx.fillRect(bleed, bleed, cellSize-bleed, cellSize-bleed);
//     offScreenCtx.strokeStyle = "#2E0A3E";
//     offScreenCtx.strokeRect(bleed, bleed, cellSize-bleed, cellSize-bleed);
//     return offScreenCtx.canvas;
// }

// const pattern = createFillPattern(camera);

const colorBuffer = {

}

const WORLD_ZERO = new Vector2(0, 0);

export const renderGrid = ({ canvas, grid, camera }: TDrawContext) => {
    const { width, height } = canvas;
    const ctx = canvas.getContext("2d", { willReadFrequently: true, alpha: false });
    if (!ctx || !camera) return;

    const cameraPosition = camera.getPosition();
    const zoomLevel = cameraPosition.z;
    const focus = getGameStore().notificationData ? [getGameStore().notificationData] : []; // TODO: replace focus
    
    const selectedHexColor = getGameStore().selectedHexColor;
    const hoveredPixel = getGameStore().hoveredPixel;
    
    const bounds = camera.calculateViewport();
    ctx.fillStyle = "#1B0C27";
    ctx.fillRect(0, 0, width, height);
    
    const bleed = 2;

    // @dev map the camera bounds to grid and add some bleed
    const start = {
        x: Math.floor(bounds.x - bleed),
        y: Math.floor(bounds.y - bleed),
    };
    const end = {
        x: Math.floor((bounds.z + bleed)),
        y: Math.floor(bounds.w + bleed),
    };

    // @dev keep var definitions outside of loop
    let pixel, isHovered, x, y, codePoint, path;
    let pixelColor = defaultColor; // default color
    let pixelText = "";

    ctx.fillStyle = defaultColor;
    const worldZero = camera.worldToCamera(WORLD_ZERO);
    ctx.fillRect(worldZero.x, worldZero.y, MAP_SIZE, MAP_SIZE);

    let pCount = 0;
    let tCount = 0;

    let cSize = null; // cellsize

    // @dev pamp it
    for (let row = start.x; row <= end.x; row++) { 
        for (let col = start.y; col <= end.y; col++) {
            if (row < 0 || col < 0) continue;
            
            // @dev CAMERASPACE > WORLDSPACE !important
            let {x,y} = camera.worldToCamera(new Vector2(row,col));

            // @dev calculate real cellsize once
            if (!cSize) {
                let n = camera.worldToCamera(new Vector2(row+1,col+1));
                cSize = n.x - x;
            }

            pixelColor = defaultColor; // default color

            isHovered = hoveredPixel && row === hoveredPixel.x && col === hoveredPixel.y;
            if (!grid.has(`[${row},${col}]`) && zoomLevel < 15 && !isHovered) continue;
            pixel = grid.get(`[${row},${col}]`) || undefined;

            if (pixel) {
                /// if hexColor from the contract is empty, then use default color
                pixel.color = pixel.color === "0x0" ? pixelColor : pixel.color.replace('0x', '#');
                // Get the current color of the pixel
                if (pixel.text && pixel.text !== "0x0") {
                    pixelText = pixel.text;
                }
                pixelColor = pixel.color;
            }

            if (isHovered) {
                pixelColor = selectedHexColor;
            }

            ctx.beginPath();
            path = new Path2D();
            path.rect(x, y, cSize, cSize);
            if (pixel || isHovered) {
                ctx.fillStyle = pixelColor;
                ctx.fill(path);
                // ctx.fillRect(x, y, cellSize+b, cellSize+b); 
                // if (zoomLevel > 8) {
                    ctx.strokeStyle = "#2E0A3E";
                    ctx.stroke(path);
                // }
                pCount++;
            } 
            else {
                ctx.fillStyle = defaultColor;
                ctx.fill(path);
                ctx.strokeStyle = "#2E0A3E";
                ctx.stroke(path);
            }

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

            if (pixelText && pixelText.length > 0) {
                ctx.textAlign = "center";

                ctx.font = `${cSize / 2}px Serif`;

                let text = felt252ToString(pixelText);

                if (pixelColor === "#000000") ctx.fillStyle = "white";
                else ctx.fillStyle = "black";

                if (text.includes("U+")) {
                    text = text.replace("U+", "");
                    codePoint = parseInt(text, 16);
                    text = String.fromCodePoint(codePoint);
                } else {
                    // FIXME: make this scale better
                    if (text.length > 4 && text.length <= 8) {
                        ctx.font = `${cSize / 4}px Serif`;
                    } else if (text.length > 8 && text.length <= 12) {
                        ctx.font = `${cSize / 6}px Serif`;
                    } else if (text.length > 12) {
                        ctx.font = `${cSize / 8}px Serif`;
                    }
                }

                ctx.fillText(text, x + cSize / 2, y + cSize / 1.5);
                tCount++;
            }
        }
    }
    // console.log("pCount", pCount, "tCount", tCount)
};
