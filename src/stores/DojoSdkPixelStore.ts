import { type Bounds, type Coordinate, MAX_DIMENSION, type PixelStore, makeString } from "@/webtools/types/types.ts"
import { MAX_VIEW_SIZE, areBoundsEqual } from "@/webtools/utils.ts"
import { useEffect, useRef, useState } from "react"

import type { Pixel, SchemaType } from "@/generated/models.gen.ts"
import { QueryBuilder, type SDK } from "@dojoengine/sdk"
import { getQueryBounds, SUBSCRIPTION_QUERY } from "@/dojo/querybuilder.ts"
import { EventEmitter } from "@/core/events.ts"

type State = { [key: string]: Pixel | undefined }

export function useDojoSdkPixelStore(sdk: SDK<SchemaType>): PixelStore {
    const state = useRef<State>({}).current
    const [queryBounds, setQueryBounds] = useState<Bounds | null>(null)
    const [cacheUpdated, setCacheUpdated] = useState<number>(Date.now())
    const isSubscribed = useRef(false)

    useEffect(() => {
        console.log("useEffect")
        if (isSubscribed.current) return

        let unsubscribe: (() => void) | undefined

        const subscribe = async () => {
            const subscription = await sdk.subscribeEntityQuery({
                query: SUBSCRIPTION_QUERY,
                callback: (response) => {
                    if (response.error) {
                        console.error("Error setting up entity sync:", response.error)
                    } else if (response.data && response.data[0].entityId !== "0x0") {
                        console.trace("callback")
                        console.log("callback", response.data[0])
                        const p = response.data[0].models.pixelaw.Pixel

                        const key = `${p?.x}_${p?.y}`
                        const pixel = {
                            ...p,
                        } as Pixel
                        console.log("set pixel", key, pixel)
                        setPixel(key, pixel)
                    }

                    setCacheUpdated(Date.now())
                },
            })

            unsubscribe = () => subscription.cancel()
        }

        console.log("subscribe")
        subscribe()
        isSubscribed.current = true
        return () => {
            if (unsubscribe) {
                console.log("unsub")
                unsubscribe()
                isSubscribed.current = false
            }
        }
    }, [sdk, state])

    useEffect(() => {
        if (queryBounds) {
            refresh()
        }
    }, [queryBounds])

    function fetchData(bounds: Bounds): void {
        let [[left, top], [right, bottom]] = bounds

        if (left > MAX_VIEW_SIZE && left > right) right = MAX_DIMENSION
        if (top > MAX_VIEW_SIZE && top > bottom) bottom = MAX_DIMENSION

        const pixelQuery = new QueryBuilder<SchemaType>()
            .namespace("pixelaw", (n) =>
                n.entity("Pixel", (e) => {
                    e.gte("x", left).gte("y", top).lte("x", right).lte("y", bottom)
                }),
            )
            .build()

        sdk.getEntities({
            query: pixelQuery,
            callback: (r) => {
                r.data?.map((entity) => {
                    // console.log(entity.models.pixelaw.Pixel)
                    const p = entity.models.pixelaw.Pixel

                    const pixel = {
                        ...p,
                        // text: shortString.decodeShortString(p.text),
                        // action: shortString.decodeShortString(p.action),
                        // timestamp: Number.parseInt(p.timestamp as string, 16),
                    } as Pixel

                    state[`${p?.x}_${p?.y}`] = pixel
                })
                // console.log("updated")
                setCacheUpdated(Date.now())
            },
        })
    }

    const refresh = (): void => {
        if (!queryBounds) return
        const [[left, top], [right, bottom]] = queryBounds
        const xWraps = right - left < 0
        const yWraps = bottom - top < 0

        if (xWraps && yWraps) {
            fetchData([
                [left, top],
                [0, 0],
            ])
            fetchData([
                [left, 0],
                [0, bottom],
            ])
            fetchData([
                [0, top],
                [right, 0],
            ])
            fetchData([
                [0, 0],
                [right, bottom],
            ])
        } else if (xWraps) {
            fetchData([
                [left, top],
                [0, bottom],
            ])
            fetchData([
                [0, top],
                [right, bottom],
            ])
        } else if (yWraps) {
            fetchData([
                [left, top],
                [right, 0],
            ])
            fetchData([
                [left, 0],
                [right, bottom],
            ])
        } else {
            fetchData([
                [left, top],
                [right, bottom],
            ])
        }
    }

    const prepare = (newBounds: Bounds): void => {
        const newQueryBounds = getQueryBounds(newBounds)

        if (!queryBounds || !areBoundsEqual(queryBounds, newQueryBounds)) {
            console.log("prep/setB", newQueryBounds)
            setQueryBounds(newQueryBounds)
        }
    }

    const getPixel = (coord: Coordinate): Pixel | undefined => {
        const key = `${coord[0]}_${coord[1]}`
        return state[key]
    }

    const setPixel = (key: string, pixel: Pixel): void => {
        // TODO: check for invalid keyss
        state[key] = pixel;
        EventEmitter.emit("pixelUpdated", { pixel });
    }

    const setPixelColor = (coord: Coordinate, color: number): void => {
        const key = makeString(coord)
        let pixel = state[key]

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

        setPixel(key, pixel)
    }

    const setPixels = (pixels: { key: string; pixel: Pixel }[]): void => {
        for (const { key, pixel } of pixels) {
            setPixel(key, pixel)
        }
    }

    return { getPixel, setPixel, setPixelColor, setPixels, prepare, refresh, setCacheUpdated, cacheUpdated }
}







// export const DojoSdkPixelStore = () => {
//     return {
//         ...useDojoSdkPixelStore.getState(),
//         set: useDojoSdkPixelStore.setState,
//     }
// }