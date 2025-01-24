import { makeString, type Bounds, type Coordinate, type PixelStore as IPixelStore, type Pixel, type TPixelStoreStatus } from "@/webtools/types/types.ts"; // FIXME: Clean up pixel type
import { EventEmitter } from "@/global/events";
import { getQueryBounds } from "@/dojo/querybuilder";
import { areBoundsEqual } from "@/webtools/utils";

// @dev Backend agnostic base class

export class BasePixelStore implements IPixelStore {
    status = () => "error" as TPixelStoreStatus;
    events = EventEmitter;
    state = new Map<string, Pixel>();
    queryBounds: Bounds | null = null;
    cacheUpdated = 0;

    getPixel = (coord: Coordinate): Pixel | undefined => {
        const key = `${coord[0]}_${coord[1]}`;
        return this.state.get(key);
    };

    refresh = (): void => {
      throw new Error("Method not implemented.");
    };

    prepare = (newBounds: Bounds): void => {
        const { queryBounds } = this;
        const newQueryBounds = getQueryBounds(newBounds);

        if (!queryBounds || !areBoundsEqual(queryBounds, newQueryBounds)) {
            // console.log("prep/setB", newQueryBounds)
            this.queryBounds = newQueryBounds;
        }
    };

    setPixel = (key: string, pixel: Pixel): void => {
        // TODO: check for invalid keyss
        this.state.set(key, pixel);
        EventEmitter.emit("pixelUpdated", { pixel: pixel as Pixel });
        this.updateCache();
    };

    setPixelColor = (coord: Coordinate, color: number): void => {
        const key = makeString(coord);
        let pixel = this.state.get(key);

        if (!pixel) {
            pixel = {
                action: "",
                color: color,
                owner: "",
                text: "",
                timestamp: Date.now(),
                x: coord[0],
                y: coord[1],
            } as Pixel;
        } else {
            pixel = {
                ...pixel,
                color,
            };
        }

        this.setPixel(key, pixel);
    };

    setPixels = (pixels: { key: string; pixel: Pixel }[]): void => {
        for (const { key, pixel } of pixels) {
            this.setPixel(key, pixel);
        }
    };

    updateCache = () => {
        this.cacheUpdated = Date.now();
    }
}