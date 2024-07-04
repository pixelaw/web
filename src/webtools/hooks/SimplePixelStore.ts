/* eslint-disable @typescript-eslint/no-unused-vars */
import { produce } from 'immer';
import { useState } from 'react';
import { type Bounds, type Coordinate, type Pixel, type PixelStore } from '../types.ts';

type State = { [key: string]: Pixel };

export function useSimplePixelStore(): PixelStore {
    const [state, setState] = useState<State>({});
    const [cacheUpdated, setCacheUpdated] = useState<number>(Date.now());

    const getPixel = (coord: Coordinate): Pixel | undefined => {
        const key = `${coord[0]}_${coord[1]}`;
        return state[key];
    };

    const setPixel = (key: string, pixel: Pixel): void => {
        setState(
            produce((draft) => {
                draft[key] = pixel;
            }),
        );
    };

    const setPixels = (pixels: { key: string; pixel: Pixel }[]): void => {
        setState(
            produce((draft) => {
                pixels.forEach(({ key, pixel }) => {
                    draft[key] = pixel;
                });
            }),
        );
    };

    const setPixelColor = (coord: Coordinate, color: number): void => {
        // No implementation for now, SimplePixelStore is a dev tool
    };

    const prepare = (_bounds: Bounds): void => {
        // No implementation for now, SimplePixelStore is a dev tool
    };

    const refresh = (): void => {
        // No implementation for now, SimplePixelStore is a dev tool
    };

    return {
        getPixel,
        setPixel,
        setPixels,
        prepare,
        refresh,
        cacheUpdated,
        setCacheUpdated,
        setPixelColor,
    };
}
