import type { Pixel, TPixelStoreStatus } from "@/webtools/types/types.ts"; // FIXME: Clean up pixel type
import { SUBSCRIPTION_QUERY } from "@/dojo/querybuilder";

import type { SDK, SchemaType } from "@dojoengine/sdk";
import type { TPackedSQLPixel } from "@/global/types";
import { BasePixelStore } from "./BasePixelStore";
import {createSqlQuery} from "@/global/utils.ts";

export class DojoSQLPixelStore extends BasePixelStore {
    status = () => {return this._status};
    private _status: TPixelStoreStatus = "loading";
    isSubscribed = () => this.subscription !== null;
    private subscription: Awaited<ReturnType<SDK<SchemaType>["subscribeEntityQuery"]>> | null = null;
    awaitingSubscription = false;

    constructor(sdk: SDK<SchemaType>) {
        super();
        console.log("asdf")
        if (this.awaitingSubscription) return;
        console.log("asdf33", this.subscription)
        if (this.isSubscribed()) {
            return;
        }
        console.log("asdf555")
        
        const subscribe = async () => {
            if (this.awaitingSubscription) return;
            this.awaitingSubscription = true;
            this.subscription = await sdk.subscribeEntityQuery({
                query: SUBSCRIPTION_QUERY,
                callback: (response) => {
                    console.log("callback", response);
                    if (response.error) {
                        console.error("Error setting up entity sync:", response.error);
                    } else if (response.data && response.data[0].entityId !== "0x0") {
                        console.log("callback", response.data[0]);
                        const p = response.data[0].models.pixelaw.Pixel;

                        const key = `${p?.x}_${p?.y}`;
                        this.setPixel(key, p as Pixel);
                    }

                    console.log(`[${this.constructor.name}] subscribed`, this);
                    this.awaitingSubscription = false;
                    this.updateCache();
                },
            });
            console.log(this.subscription)
        };

        subscribe();
        this.refresh();
    };

    async unload() { 
        console.log("unload")
        if (this.subscription) {
            console.log(`[${this.constructor.name}] unsubscribed`);
            await this.subscription.cancel();
            this.subscription = null;
        }
    };

    refresh = async (): void => {
        console.log("refresh")
        const { queryBounds } = this;
        if (!queryBounds) return;

        const query = encodeURIComponent(createSqlQuery(queryBounds));
        console.log(`http://localhost:8080/sql?query=${query}`)
        fetch(`http://localhost:8080/sql?query=${query}`, {}) // FIXME: hardcoded
            .then((response) => {
                console.log("refresh", response, "call")
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                response
                    .json()
                    .then((json) => {
                        console.log("pixelitems")
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

}