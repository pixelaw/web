import { ZOOM_FACTOR } from "./constants.ts"

import {
    type Bounds,
    type Coordinate,
    DEFAULT_SCALEFACTOR,
    type Dimension,
    MAX_DIMENSION,
    Pixel,
    TILESIZE,
} from "@/types.ts"

export const MAX_VIEW_SIZE = 1_000_000

export function randomColor(): number {
    // Generate random RGB color
    const r = Math.floor(Math.random() * 256)
    const g = Math.floor(Math.random() * 256)
    const b = Math.floor(Math.random() * 256)

    // Encode RGB color to int
    return (r << 24) + (g << 16) + (b << 8)
}

// TODO check if this works with negative change
export function getWrappedTileCoordinate(startingWorldCoordinate: number, index: number, tileRenderSize: number) {
    let result = startingWorldCoordinate + index

    if (result > MAX_DIMENSION) {
        result %= MAX_DIMENSION + 1
    }

    if (startingWorldCoordinate > result) {
        result -= result % tileRenderSize
    }

    return result
}

// Change positive means panning right (moving mouse right)
// So more becomes visible on the left side
function handlePixelChange(pixelOffset: number, worldOffset: number, change: number, cellWidth: number): number[] {
    pixelOffset += change

    if (pixelOffset > cellWidth - 1) {
        // Going beyond 9
        worldOffset = worldOffset -= Math.floor(pixelOffset / cellWidth)
        pixelOffset = (pixelOffset + cellWidth) % cellWidth
    } else if (pixelOffset < 0) {
        // Dropping below 0
        worldOffset = worldOffset + 1 + Math.abs(Math.ceil(pixelOffset / cellWidth))
        pixelOffset = ((pixelOffset % cellWidth) + cellWidth) % cellWidth
    }

    return [pixelOffset, worldOffset]
}

export function handlePixelChanges(
    pixelOffset: Coordinate,
    worldOffset: Coordinate,
    change: Coordinate,
    cellWidth: number,
): Coordinate[] {
    const [newPixelOffsetX, newWorldOffsetX] = handlePixelChange(pixelOffset[0], worldOffset[0], change[0], cellWidth)
    const [newPixelOffsetY, newWorldOffsetY] = handlePixelChange(pixelOffset[1], worldOffset[1], change[1], cellWidth)

    return [
        [newPixelOffsetX, newPixelOffsetY],
        [newWorldOffsetX, newWorldOffsetY],
    ]
}

export function dimensionFromBounds(bounds: Bounds): Dimension {
    let width = 0
    let height = 0

    const [[left, top], [right, bottom]] = bounds

    const xWraps = right - left < 0
    const yWraps = bottom - top < 0

    width = xWraps ? MAX_DIMENSION - left + right : right - left
    height = yWraps ? MAX_DIMENSION - top + bottom : bottom - top

    return [width, height]
}

/*
export function changePixelOffset(offset: number, change: number, cellWidth: number): number {
    // (pixelOffset[0] + e.clientX - lastDragPoint[0] + cellWidth) % cellWidth
    console.log("offset", offset, "change", change)
    let result = (offset + change + cellWidth) % cellWidth
    return result
}
*/
export function wrapOffsetChange(offset: number, change: number): number {
    let result = offset + change
    if (result > MAX_DIMENSION) result = result % (MAX_DIMENSION + 1)
    return result
}

export function getInitialOffset(tileCoord: number, worldCoord: number, offset: number) {
    // offset = uint2relative(offset)
    let result = worldCoord - tileCoord

    if (result > 0 && offset > 0) result -= 1
    return result
}

export function nextTileCoord(tileCoord: number, tileSize: number) {
    let result = tileCoord + tileSize
    if (result >= MAX_DIMENSION) result = 0
    return result
}

export const numRGBAToHex = (rgba: number | undefined) => {
    if (rgba === undefined) return "#0000EE" // TODO Maybe return default color?
    const color = rgba >>> 8
    return `#${color.toString(16).padStart(6, "0")}`
}
/*

export async function fillPixelData(imageUrl: string, setPixels: (pixels: { key: string, pixel: Pixel }[]) => void) {
    // Fetch PNG file
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();

    // Decode PNG file
    const decodedImage = UPNG.decode(arrayBuffer);
    const rgbaValues: Uint8Array = new Uint8Array(UPNG.toRGBA8(decodedImage)[0]);

    const pixels = []

    for (let y = 0; y < decodedImage.height; y++) {
        for (let x = 0; x < decodedImage.width; x++) {
            const idx = (decodedImage.width * y + x) << 2;

            // Get RGB color from PNG
            const r = rgbaValues[idx];
            const g = rgbaValues[idx + 1];
            const b = rgbaValues[idx + 2];
            const a = rgbaValues[idx + 3];
            // Encode RGB color to int
            const color = (r << 24) | (g << 16) | (b << 8) | a;

            pixels.push({
                key: `${x},${y}`, pixel: {
                    action: "", color, id: "", owner: "", text: ""
                }
            })
        }
    }
    setPixels(pixels)
}
*/

export async function clearIdb() {
    console.log("Clearing keyval indexDB")
    const DB_NAME = "keyval-store" // replace with your database name
    const DB_STORE_NAME = "keyval" // replace with your store name

    const request = indexedDB.open(DB_NAME)

    request.onsuccess = () => {
        const db = request.result
        const transaction = db.transaction([DB_STORE_NAME], "readwrite")
        const objectStore = transaction.objectStore(DB_STORE_NAME)
        objectStore.clear()
    }
}

// Returns viewport cell for the given relative viewport position
export function cellForPosition(zoom: number, pixelOffset: Coordinate, position: Coordinate): Coordinate {
    const cellSize = getCellSize(zoom)

    const [offsetLeft, offsetTop] = pixelOffset
    const [posX, posY] = position

    // Determine where the topleft cell would start drawing (offscreen because of the scrolling offset)
    const startDrawingAtX = 0 - offsetLeft
    const startDrawingAtY = 0 - offsetTop

    const x = Math.floor((posX - startDrawingAtX) / cellSize)
    const y = Math.floor((posY - startDrawingAtY) / cellSize)

    return [x, y]
}

export function getCellSize(zoom: number) {
    return zoom / ZOOM_FACTOR
}

export function uint2relative(nr: number): number {
    if (nr > MAX_DIMENSION || nr / MAX_DIMENSION > 0.5) {
        return nr - MAX_DIMENSION - 1
    }
    return nr
}

export function relative2uint(nr: number): number {
    if (nr < 0) {
        return MAX_DIMENSION + nr + 1
    }
    return nr
}

export function calculateTileBounds(inputBounds: Bounds): Bounds {
    const [topLeft, bottomRight] = inputBounds

    // Determine the world coordinate size of each tile
    // Example, when tilesize is 100 and tileScaleFactor is 10, there will be 1000 world coordinates in one tile's width/height
    // and, when tilesize is 100 and tileScaleFactor is 1, there will be 100 world coordinates in one tile's width/height
    const tileWorldSize = TILESIZE * DEFAULT_SCALEFACTOR

    // snap the left/top borders to tilesizes to find the tile names
    // Simple example: if requested left world coord is 523 and tileWorldsize is 100, we "snap" to 500
    const [left, top] = topLeft
    const leftTileCoord = left - (left % tileWorldSize)
    const topTileCoord = top - (top % tileWorldSize)

    const [right, bottom] = bottomRight
    const rightTileCoord = right + (tileWorldSize - (right % tileWorldSize))
    const bottomTileCoord = bottom + (tileWorldSize - (bottom % tileWorldSize))

    return [
        [leftTileCoord, topTileCoord],
        [rightTileCoord, bottomTileCoord],
    ]
}

export function areBoundsEqual(boundsA: Bounds, boundsB: Bounds): boolean {
    // Compare top-left coordinates
    if (boundsA[0][0] !== boundsB[0][0] || boundsA[0][1] !== boundsB[0][1]) {
        return false
    }
    // Compare bottom-right coordinates
    if (boundsA[1][0] !== boundsB[1][0] || boundsA[1][1] !== boundsB[1][1]) {
        return false
    }
    return true
}

// Apply WorldOffset to viewport coordinates
// WorldOffset means "number to add to world to get view"
// So it returns "viewport - WorldOffset"
// Negative WO means the result increases
export function applyWorldOffset(worldOffset: Coordinate, viewportCoord: Coordinate): Coordinate {
    function fn(viewport: number, world: number): number {
        // const nor = world % 4294967295
        // Convert world to a relative value
        const rel = uint2relative(world)
        const raw = viewport - rel
        const uint = relative2uint(raw)

        return uint
    }

    // Convert 4294967295 to -1
    // maxuint - 4294967295 -1

    // TODO properly handle input 4294967295
    /// 1 - raw - MAX_DIMENSION
    return [fn(viewportCoord[0], worldOffset[0]), fn(viewportCoord[1], worldOffset[1])]
}

export function worldToView(worldOffset: number, worldCoord: number, scaleFactor: number, tileSize: number): number {
    const tileRenderSize = tileSize * scaleFactor

    const tileWrapDiff = MAX_DIMENSION % tileSize

    const startOfBorderTile = MAX_DIMENSION - tileWrapDiff

    const isBorder = worldCoord >= startOfBorderTile

    const raw = worldCoord + uint2relative(worldOffset)

    const didCrossBorder = raw > MAX_DIMENSION

    // So MAX_DIMENSION +1 needs to become 0
    const unwrapped = didCrossBorder ? 1 - raw - MAX_DIMENSION : raw

    let relative = unwrapped

    if (unwrapped > MAX_VIEW_SIZE && isBorder) {
        // example: 4294967294 (is -1)
        relative = unwrapped - MAX_DIMENSION
    } else if (unwrapped > MAX_VIEW_SIZE && !isBorder) {
        // example: 4294967205 (is -95)
        relative = unwrapped - MAX_DIMENSION - (tileSize - tileWrapDiff)
    }

    // Scale
    const scaled = (relative * scaleFactor) % tileRenderSize

    return scaled
}

export function miniUID() {
    return (
        `000${((Math.random() * 46656) | 0).toString(36)}`.slice(-3) +
        `000${((Math.random() * 46656) | 0).toString(36)}`.slice(-3)
    )
}
