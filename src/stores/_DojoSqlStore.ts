import type { Pixel } from "@/webtools/types"; // FIXME: Clean up pixel type
import { SUBSCRIPTION_QUERY } from "@/dojo/querybuilder";
import { createSqlQuery } from "./DojoSqlPixelStore";
import type { SDK, SchemaType } from "@dojoengine/sdk";
import type { TPackedSQLPixel } from "@/global/types";
import { BasePixelStore } from "./BasePixelStore";

export class DojoSQLPixelStore extends BasePixelStore {
    isSubscribed = () => this.subscription !== null;
    private subscription: Awaited<ReturnType<SDK<SchemaType>["subscribeEntityQuery"]>> | null = null;
    awaitingSubscription = false;

    constructor(sdk: SDK<SchemaType>) {
        super();
        if (this.awaitingSubscription) return;

        if (this.isSubscribed()) {
            return;
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

}