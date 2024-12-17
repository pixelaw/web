import type { Manifest } from "@dojoengine/core"

export type Pixel = {
    action: string
    color: number | string
    owner: string
    text: string
    timestamp: number | string
    x: number
    y: number
}

export type App = {
    system: string
    name: string
    // manifest: string
    icon: string
    action: string
    entity: {
        id: string
    }
}

export type Tile = HTMLImageElement

export type TileChangedMessage = {
    tileName: string
    timestamp: number
}

export interface UpdateService {
    tileChanged: TileChangedMessage | null
    setBounds: (newBounds: Bounds) => void
}

export interface AppStore {
    getByName: (name: string) => App | undefined
    getAll: () => App[]
}

export interface PixelStore {
    refresh: () => void
    prepare: (bounds: Bounds) => void
    getPixel: (coordinate: Coordinate) => Pixel | undefined
    setPixelColor: (coord: Coordinate, color: number) => void
    setPixel: (key: string, pixel: Pixel) => void
    setPixels: (pixels: { key: string; pixel: Pixel }[]) => void
    setCacheUpdated: (value: number) => void
    cacheUpdated: number
}

export interface TileStore {
    refresh: () => void
    prepare: (bounds: Bounds) => void
    fetchTile: (key: string) => void
    // getTile: (key: string) => Tile | undefined | "";
    // setTile: (key: string, tile: Tile) => Promise<void>;
    setTiles: (tiles: { key: string; tile: Tile }[]) => Promise<void>
    tileset: Tileset | null
    cacheUpdated: number
}

export interface Tileset {
    tileSize: number
    scaleFactor: number
    bounds: Bounds
    tileRows: (Tile | undefined | "")[][]
}

export type Dimension = [width: number, height: number]
export type Coordinate = [number, number]
export type Bounds = [topLeft: Coordinate, bottomRight: Coordinate]

// export const MAX_DIMENSION: number = 4_294_967_295
export const MAX_DIMENSION: number = 32_767 // 2**15 -1

// Don't query everytime bounds change, but only when the buffer resolution changes
// So when bounds change from 5 to 6, but Buffer is 10, no requery happens
export const QUERY_BUFFER: number = 10

export const TILESIZE = 100

// TODO handle scalefactor 10 later
export const DEFAULT_SCALEFACTOR = 1

export function makeString<Coordinate>(coordinate: Coordinate): string {
    if (!Array.isArray(coordinate) || coordinate.length !== 2) {
        throw new Error("Invalid coordinate")
    }
    return `${coordinate[0]}_${coordinate[1]}`
}
