import { get as getIdb, keys, set as setIdb } from "idb-keyval";
import {
    type Bounds,
    DEFAULT_SCALEFACTOR,
    MAX_DIMENSION,
    TILESIZE,
    type Tile,
    type TileStore,
    type Tileset,
} from "@/webtools/types/types.ts";
import { MAX_VIEW_SIZE, areBoundsEqual, calculateTileBounds, getWrappedTileCoordinate } from "@/webtools/utils.ts";

type State = { [key: string]: HTMLImageElement | undefined | "" };

export class RestTileStore implements TileStore {
    private tilesLoaded: boolean = false;
    private isLoading: boolean = true;
    private fetchCounter: number = 0;
    public tileset: Tileset | null = null;
    private tileCache: State = {};
    private actualBounds: Bounds | null = null;
    private inputBounds: Bounds | null = null;
    public cacheUpdated: number = Date.now();
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
        this.loadFromIdb();
    }

    private async loadFromIdb() {
        this.isLoading = true;
        const keysArray = await keys();
        const tilesObj: Record<string, Tile | undefined | ""> = {};

        for (const key of keysArray) {
            if (typeof key === "string") {
                try {
                    const base64 = await getIdb(key);
                    if (base64.length === 0) {
                        tilesObj[key] = "";
                    } else {
                        tilesObj[key] = await this.loadImage(base64);
                    }
                } catch (e) {
                    console.log("Error loading", key, e);
                }
            }
        }
        this.tileCache = tilesObj;
        this.tilesLoaded = true;
        this.cacheUpdated = Date.now();
        this.isLoading = false;
    }

    private fetchTile(key: string) {
        this.fetchCounter++;

        this.fetchImage(`${this.baseUrl}/${key}.png`)
            .then(async (base64Img) => {
                await setIdb(key, base64Img);
                this.tileCache[key] = await this.loadImage(base64Img);
                this.fetchCounter--;
                this.cacheUpdated = Date.now();
            })
            .catch((e) => {
                setIdb(key, "").then(() => {
                    this.tileCache[key] = "";
                    this.fetchCounter--;
                });
                this.cacheUpdated = Date.now();
                console.info("Error loading image:", key, e);
            });
    }

    public prepare(newBounds: Bounds): void {
        if (!this.inputBounds || !areBoundsEqual(this.inputBounds, newBounds)) {
            this.inputBounds = newBounds;
            const ab = calculateTileBounds(newBounds);

            if (!this.actualBounds || !areBoundsEqual(this.actualBounds, ab)) {
                this.actualBounds = ab;
                this.refresh();
            }
        }
    }

    public refresh(): void {
        if (this.isLoading || !this.actualBounds) return;

        const [[leftTileCoord, topTileCoord], [rightTileCoord, bottomTileCoord]] = this.actualBounds;
        console.log("refresh", JSON.stringify(this.actualBounds));

        const tileRows = [];

        function distance(begin: number, end: number): number {
            return end >= begin ? end - begin : MAX_DIMENSION - begin + end;
        }

        const width = distance(leftTileCoord, rightTileCoord);
        const height = distance(topTileCoord, bottomTileCoord);

        const tileWorldSize = TILESIZE * DEFAULT_SCALEFACTOR;

        for (let x = 0; x <= width; x += tileWorldSize) {
            const tileRow: (Tile | undefined | "")[] = [];
            for (let y = 0; y <= height; y += tileWorldSize) {
                const tileX = getWrappedTileCoordinate(leftTileCoord, x, tileWorldSize);
                const tileY = getWrappedTileCoordinate(topTileCoord, y, tileWorldSize);
                tileRow.push(this.getTile(`${DEFAULT_SCALEFACTOR}_${TILESIZE}_${tileX}_${tileY}`));
            }
            tileRows.push(tileRow);
        }

        this.tileset = {
            tileSize: TILESIZE,
            bounds: this.actualBounds,
            scaleFactor: DEFAULT_SCALEFACTOR,
            tileRows,
        };

        this.cacheUpdated = Date.now();
    }

    private getTile(key: string): Tile | undefined | "" {
        if (this.tileCache[key] === undefined) {
            this.tileCache[key] = "";
            this.fetchTile(key);
        }
        return this.tileCache[key];
    }

    public async setTiles(_tiles: { key: string; tile: Tile }[]): Promise<void> {
        // Implementation for setting tiles if needed
    }

    private loadImage(base64: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = base64;
        });
    }

    private async fetchImage(src: string): Promise<string> {
        const response = await fetch(src);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    public getCacheUpdated(): number {
        return this.cacheUpdated;
    }

    public getTileset(): Tileset | null {
        return this.tileset;
    }
}


