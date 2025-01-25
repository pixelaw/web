import type { Bounds, Coordinate, Pixel } from "@/webtools/types/types.ts"
import type mitt from "mitt"

// export type TPixelStoreStatus = "ready" | "loading" | "error"

export type PixelStoreEvents = {
    cacheUpdated: number
}

export interface PixelStore {
    eventEmitter: ReturnType<typeof mitt<PixelStoreEvents>>
    refresh: () => void
    prepare: (bounds: Bounds) => void
    getPixel: (coordinate: Coordinate) => Pixel | undefined
    setPixelColor: (coord: Coordinate, color: number) => void
    setPixel: (key: string, pixel: Pixel) => void
    setPixels: (pixels: { key: string; pixel: Pixel }[]) => void
    unload?: () => Promise<void>
    // updateCache: () => void
    // cacheUpdated: number
}
