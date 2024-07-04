import { type Coordinate, MAX_UINT32, type Tileset } from '../../types.ts';
import { applyWorldOffset, nextTileCoord, getInitialOffset } from '../../utils.ts';
import { ZOOM_FACTOR } from './constants.ts';

export function drawTiles(
    context: CanvasRenderingContext2D,
    zoom: number,
    pixelOffset: Coordinate,
    worldOffset: Coordinate,
    tileset: Tileset,
) {
    const topLeftWorld = applyWorldOffset(worldOffset, [0, 0]);

    const scaleFactor = zoom / ZOOM_FACTOR;
    const [cellOffsetX, cellOffsetY] = pixelOffset;

    if (!tileset) return;

    // tileTopLeft is the world position of the topleft tile returned for the given world coord (which is not "snapped" to a tile yet)
    const {
        tileRows,
        tileSize,
        bounds: [tileTopLeft],
    } = tileset;

    if (!tileRows.length) {
        console.log('norows');
        return;
    }
    // TODO deal with tileScaleFactor other than 1 (when zoomed out very far)

    const tileCoords = [...tileTopLeft];

    const tileSizes = [
        tileTopLeft[0] + tileSize > MAX_UINT32 ? MAX_UINT32 % tileSize : tileSize,
        tileTopLeft[1] + tileSize > MAX_UINT32 ? MAX_UINT32 % tileSize : tileSize,
    ];

    const initialOffsets: Coordinate = [
        getInitialOffset(tileTopLeft[0], topLeftWorld[0], worldOffset[0]),
        getInitialOffset(tileTopLeft[1], topLeftWorld[1], worldOffset[1]),
    ];

    let destY = 0 - initialOffsets[1] * scaleFactor - cellOffsetY;

    for (let y = 0; y < tileRows[0].length; y++) {
        let destX = 0 - initialOffsets[0] * scaleFactor - cellOffsetX;

        tileCoords[0] = tileTopLeft[0];
        tileSizes[0] = tileTopLeft[0] + tileSize > MAX_UINT32 ? MAX_UINT32 % tileSize : tileSize;

        for (let x = 0; x < tileRows.length; x++) {
            const tile = tileRows[x][y];
            if (tile) {
                const sourceWidth = tileSizes[0];
                const sourceHeight = tileSizes[1];

                const destWidth = tileSizes[0] * scaleFactor;
                const destHeight = tileSizes[1] * scaleFactor;

                context.drawImage(
                    tile, // source image
                    0, // source x
                    0, // source y
                    sourceWidth,
                    sourceHeight,
                    destX,
                    destY,
                    destWidth,
                    destHeight,
                );
            }

            destX += tileSizes[0] * scaleFactor;

            tileCoords[0] = nextTileCoord(tileCoords[0], tileSizes[0]);

            tileSizes[0] =
                tileCoords[0] + tileSize >= MAX_UINT32 ? MAX_UINT32 % tileSize : tileSize;
        }

        tileCoords[1] = nextTileCoord(tileCoords[1], tileSizes[1]);

        destY += tileSizes[1] * scaleFactor;

        tileSizes[1] = tileCoords[1] + tileSize >= MAX_UINT32 ? MAX_UINT32 % tileSize : tileSize;
    }
    console.groupEnd();
}
