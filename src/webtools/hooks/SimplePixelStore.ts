import { useRef, useState } from "react"
import type { Bounds, Coordinate, Pixel, PixelStore } from "../types.ts"

type State = { [key: string]: Pixel }

export function useSimplePixelStore(): PixelStore {
    const state = useRef<State>({}).current
    const [cacheUpdated, setCacheUpdated] = useState<number>(Date.now())

    const getPixel = (coord: Coordinate): Pixel | undefined => {
        const key = `${coord[0]}_${coord[1]}`
        return state[key]
    }

    const setPixel = (key: string, pixel: Pixel): void => {
        state[key] = pixel
    }

    const setPixels = (pixels: { key: string; pixel: Pixel }[]): void => {
        for (const { key, pixel } of pixels) {
            state[key] = pixel
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const prepare = (_bounds: Bounds): void => {
        // No implementation for now, SimplePixelStore is a dev tool
    }

    const refresh = (): void => {
        // No implementation for now, SimplePixelStore is a dev tool
    }

    return {
        setCacheUpdated,
        setPixelColor(_coord: Coordinate, _color: number): void {},
        getPixel,
        setPixel,
        setPixels,
        prepare,
        refresh,
        cacheUpdated,
    }
}
