import { makeString, type Bounds, type Coordinate, type PixelStore, type Pixel } from "@/webtools/types"; // FIXME: Clean up pixel type
import { EventEmitter } from "@/global/events";
import { getQueryBounds, SUBSCRIPTION_QUERY } from "@/dojo/querybuilder";
import { areBoundsEqual } from "@/webtools/utils";
import { createSqlQuery } from "./DojoSqlPixelStore";
import type { SDK, SchemaType } from "@dojoengine/sdk";
import type { TPackedSQLPixel } from "@/global/types";

class _DojoSQLPixelStore implements PixelStore {
    uid = Math.random()* 100;
    events = EventEmitter; //FIXME: use instance instead of global
    state = new Map<string, Pixel>();
    queryBounds: Bounds | null = null;
    cacheUpdated = -1;
    isSubscribed = () => this.subscription !== null;
    private subscription: Awaited<ReturnType<SDK<SchemaType>["subscribeEntityQuery"]>> | null = null;
    awaitingSubscription = false;

    setup = (sdk: SDK<SchemaType>) => {
        if (this.awaitingSubscription) return;

        if (this.isSubscribed()) {
            return;
            this.unsubscribe();
        }

        const subscribe = async () => {
            this.awaitingSubscription = true;
            this.subscription = await sdk.subscribeEntityQuery({
                query: SUBSCRIPTION_QUERY,
                callback: (response) => {
                    if (response.error) {
                        console.error("Error setting up entity sync:", response.error);
                    } else if (response.data && response.data[0].entityId !== "0x0") {
                        console.log("callback", response.data[0]);
                        const p = response.data[0].models.pixelaw.Pixel;

                        const key = `${p?.x}_${p?.y}`;
                        this.setPixel(key, p as Pixel);
                    }

                    this.cacheUpdated = Date.now();
                    console.log(`[${this.constructor.name}] subscribed`, this);
                    this.awaitingSubscription = false;
                },
            });
        };

        subscribe();
    };

    unsubscribe = () => {
        if (this.subscription) {
            console.log(`[${this.constructor.name}] unsubscribed`);
            this.subscription.cancel();
            this.subscription = null;
        }
    };

    getPixel = (coord: Coordinate): Pixel | undefined => {
        const key = `${coord[0]}_${coord[1]}`;
        return this.state.get(key);
    };

    refresh = (): void => {
        const { queryBounds } = this;
        if (!queryBounds) return;

        const query = encodeURIComponent(createSqlQuery(queryBounds));
        fetch(`http://localhost:8080/sql?query=${query}`, {}) // FIXME: hardcoded
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                response
                    .json()
                    .then((json) => {
                        const pixelItems = json.map((p: TPackedSQLPixel) => {
                            const x = p.v >> 16;
                            const y = p.v & 0xffff;

                            const pixel = { color: p.c, x, y, text: p.t } as Pixel;
                            return { key: `${x}_${y}`, pixel };
                        });

                        this.setPixels(pixelItems);
                    })
                    .catch((e) => {
                        console.error("error parsing json", e);
                    });
            })
            .catch((error) => {
                console.log("neee", error);
            });
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
}

const DojoSQLPixelStore = new _DojoSQLPixelStore();

export { DojoSQLPixelStore };
