import { type Bounds, type Coordinate, MAX_DIMENSION, type PixelStore, makeString } from "@/webtools/types.ts";
import { MAX_VIEW_SIZE, areBoundsEqual } from "@/webtools/utils.ts";
import { produce } from "immer";
import { useEffect, useState } from "react";
import { shortString } from "starknet";
import { Pixel, SchemaType } from "@/generated/models.gen.ts";
import { QueryBuilder, SDK } from "@dojoengine/sdk";
import {buildPixelQuery} from "@/dojo/querybuilder.ts";

type State = { [key: string]: Pixel | undefined };


export function useDojoSdkPixelStore(sdk: SDK<SchemaType>): PixelStore {
    const [state, setState] = useState<State>({});
    const [bounds, setBounds] = useState<Bounds | null>(null);
    const [cacheUpdated, setCacheUpdated] = useState<number>(Date.now());

    useEffect(() => {
        if (!bounds) return;

        let unsubscribe: (() => void) | undefined;

        const subscribe = async () => {
            const query = buildPixelQuery(bounds);
            console.log("query", JSON.stringify(query));
            const subscription = await sdk.subscribeEntityQuery({
                query,
                callback: (response) => {
                    if (response.error) {
                        console.error("Error setting up entity sync:", response.error);
                    } else if (response.data && response.data[0].entityId !== "0x0") {
                        console.log("callback", response.data[0]);
                        const p = response.data[0].models.pixelaw.Pixel;

                        const pixel: Pixel = {
                            ...p,
                        };

                        setState(
                            produce((draftState) => {
                                draftState[`${p?.x}_${p?.y}`] = pixel;
                            }),
                        );
                    }

                    setCacheUpdated(Date.now());
                },
            });

            unsubscribe = () => subscription.cancel();
        };

        subscribe();
        return () => {
            if (unsubscribe) {
                console.log("unsub");
                unsubscribe();
            }
        };
    }, [sdk, bounds]);

    useEffect(() => {
        if (bounds) {
            refresh();
        }
    }, [bounds]);


    const refresh = (): void => {

        if(!bounds) return
        const pixelQuery = buildPixelQuery(bounds);

        sdk.getEntities({query: pixelQuery, callback: r => {
                r.data?.map((entity) => {
                    console.log("loading pixel");
                    const p = entity.models.pixelaw.Pixel;

                    const pixel: Pixel = {
                        ...p,
                    };

                    setState(
                        produce((draftState) => {
                            draftState[`${p?.x}_${p?.y}`] = pixel;
                        }),
                    );
                });
                console.log("updated");
                setCacheUpdated(Date.now());
            }})
    };

    const prepare = (newBounds: Bounds): void => {
        if ( newBounds && (!bounds || !areBoundsEqual(bounds, newBounds))) {
            console.log("prep/setB", newBounds)
            setBounds(newBounds);
            refresh();
        }
    };

    const getPixel = (coord: Coordinate): Pixel | undefined => {
        const key = `${coord[0]}_${coord[1]}`;

        return state[key];
    };

    const setPixelColor = (coord: Coordinate, color: number): void => {
        const key = makeString(coord);
        let pixel = state[key];

        if (!pixel) {
            pixel = {
                action: "",
                color: color,
                owner: "",
                text: "",
                timestamp: Date.now(),
                x: coord[0],
                y: coord[1],
            };
        } else {
            pixel = {
                ...pixel,
                color,
            };
        }

        setState(
            produce((draft) => {
                draft[key] = pixel;
            }),
        );
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
                for (const { key, pixel } of pixels) {
                    draft[key] = pixel;
                }
            }),

        )
    }

    return {getPixel, setPixel, setPixelColor, setPixels, prepare, refresh, setCacheUpdated, cacheUpdated}
}
