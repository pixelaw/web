import type { PixelStore, PixelStoreEvents } from "@/core/PixelStore.types.ts"
import { SUBSCRIPTION_QUERY, getQueryBounds } from "@/dojo/querybuilder.ts"
import type { SchemaType } from "@/generated/models.gen.ts"
import { createSqlQuery } from "@/global/utils.ts"
import { type Bounds, type Coordinate, type Pixel, makeString } from "@/webtools/types/types.ts"
import { areBoundsEqual } from "@/webtools/utils.ts"
import type { SDK } from "@dojoengine/sdk"
import mitt from "mitt"

type State = { [key: string]: Pixel | undefined }

class DojoSqlPixelStore implements PixelStore {
    public readonly eventEmitter = mitt<PixelStoreEvents>()
    private static instance: DojoSqlPixelStore
    private state: State = {}
    private queryBounds: Bounds | null = null
    private cacheUpdated: number = Date.now()
    private isSubscribed = false
    private sdk: SDK<SchemaType>
    private worker: Worker

    constructor(sdk: SDK<SchemaType>) {
        this.sdk = sdk
        this.worker = new Worker(new URL("@/workers/pixelSql.ts", import.meta.url), { type: "module" })
        this.worker.onmessage = this.handleRefreshWorker.bind(this)
        this.subscribe()
    }

    public static getInstance(sdk: SDK<SchemaType>): DojoSqlPixelStore {
        if (!DojoSqlPixelStore.instance) {
            DojoSqlPixelStore.instance = new DojoSqlPixelStore(sdk)
        }
        return DojoSqlPixelStore.instance
    }

    private async subscribe() {
        if (this.isSubscribed) return

        try {
            const subscription = await this.sdk.subscribeEntityQuery({
                // @ts-ignore TODO fix the type of query
                query: SUBSCRIPTION_QUERY,
                callback: (response) => {
                    if (response.error) {
                        console.error("Error setting up entity sync:", response.error)
                    } else if (response.data && response.data[0].entityId !== "0x0") {
                        const p = response.data[0].models.pixelaw.Pixel
                        const key = `${p?.x}_${p?.y}`
                        this.setPixel(key, p as Pixel)
                    }
                    this.cacheUpdated = Date.now()
                },
            })

            this.isSubscribed = true
            return () => {
                subscription.cancel()
                this.isSubscribed = false
            }
        } catch (error) {
            console.error("Subscription error:", error)
        }
    }

    private handleRefreshWorker(event: MessageEvent) {
        const { success, data, error } = event.data
        if (success) {
            this.state = { ...data }

            this.eventEmitter.emit("cacheUpdated", Date.now())
            console.log("pixels in cache: ", Object.keys(this.state).length)
        } else {
            console.error("RefreshWorker error:", error)
        }
    }

    public refresh(): void {
        console.log(JSON.stringify(this.queryBounds))
        if (!this.queryBounds) return
        const q = createSqlQuery(this.queryBounds)

        const query = encodeURIComponent(q)

        this.worker.postMessage({ query })
    }

    public prepare(newBounds: Bounds): void {
        const newQueryBounds = getQueryBounds(newBounds)

        if (!this.queryBounds || !areBoundsEqual(this.queryBounds, newQueryBounds)) {
            this.queryBounds = newQueryBounds
        }
    }

    public getPixel(coord: Coordinate): Pixel | undefined {
        const key = `${coord[0]}_${coord[1]}`
        return this.state[key]
    }

    public setPixel(key: string, pixel: Pixel): void {
        this.state[key] = pixel
    }

    public setPixelColor(coord: Coordinate, color: number): void {
        const key = makeString(coord)
        let pixel = this.state[key]

        if (!pixel) {
            pixel = {
                action: "",
                color: color,
                owner: "",
                text: "",
                timestamp: Date.now(),
                x: coord[0],
                y: coord[1],
            } as Pixel
        } else {
            pixel = {
                ...pixel,
                color,
            }
        }

        this.setPixel(key, pixel)
    }

    public setPixels(pixels: { key: string; pixel: Pixel }[]): void {
        for (const { key, pixel } of pixels) {
            this.setPixel(key, pixel)
        }
    }

    public updateCache() {}

    public setCacheUpdated(value: number): void {
        this.cacheUpdated = value
    }

    public getCacheUpdated(): number {
        return this.cacheUpdated
    }
}

export default DojoSqlPixelStore
