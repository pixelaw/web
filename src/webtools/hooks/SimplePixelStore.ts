import { produce } from "immer"
import { useState } from "react"
import type { Bounds, Coordinate, Pixel, PixelStore } from "../types.ts"

type State = { [key: string]: Pixel }

export function useSimplePixelStore(): PixelStore {
    const [state, setState] = useState<State>({})
    const [cacheUpdated, setCacheUpdated] = useState<number>(Date.now())

    const getPixel = (coord: Coordinate): Pixel | undefined => {
        const key = `${coord[0]}_${coord[1]}`
        return state[key]
    }

    const setPixel = (key: string, pixel: Pixel): void => {
        setState(
            produce((draft) => {
                draft[key] = pixel
            }),
        )
    }

    const setPixels = (pixels: { key: string; pixel: Pixel }[]): void => {
        setState(
            produce((draft) => {
                for (const { key, pixel } of pixels) {
                    draft[key] = pixel
                }
            }),
        )
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const prepare = (_bounds: Bounds): void => {
        // No implementation for now, SimplePixelStore is a dev tool
    }

    const refresh = (): void => {
        // No implementation for now, SimplePixelStore is a dev tool
    }

    return {
        setCacheUpdated(_value: number): void {},
        setPixelColor(_coord: Coordinate, _color: number): void {},
        getPixel,
        setPixel,
        setPixels,
        prepare,
        refresh,
        cacheUpdated,
    }
}
