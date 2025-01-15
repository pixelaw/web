import { type Bounds, type Coordinate, MAX_DIMENSION, type PixelStore, makeString } from "@/webtools/types.ts"
import { MAX_VIEW_SIZE, areBoundsEqual } from "@/webtools/utils.ts"
import { produce } from "immer"
import { useEffect, useRef, useState } from "react"

import { SUBSCRIPTION_QUERY, getQueryBounds } from "@/dojo/querybuilder.ts"
import type { Pixel, SchemaType } from "@/generated/models.gen.ts"
import { QueryBuilder, type SDK } from "@dojoengine/sdk"
import { EventEmitter } from "@/global/events"

type State = { [key: string]: Pixel | undefined }

export function createSqlQuery(bounds: Bounds) {
    const [[left, top], [right, bottom]] = bounds

    const xWraps = right - left < 0
    const yWraps = bottom - top < 0

    // if (left > MAX_VIEW_SIZE && left > right) right = MAX_DIMENSION
    // if (top > MAX_VIEW_SIZE && top > bottom) bottom = MAX_DIMENSION

    let result = `SELECT color as 'c', substr(text,  -4) as 't', (x << 16) | y AS v
                    FROM "pixelaw-Pixel"
                    WHERE( x > 0 ) `

    const ZERO = 0

    if (xWraps && yWraps) {
        // Quadrant 1   (topleft)
        result += ` OR(x >= ${left} AND y >= ${top} AND x <= ${MAX_DIMENSION} AND y <= ${MAX_DIMENSION} )`

        // Quadrant 2   (bottomleft)
        result += ` OR(x >= ${left} AND y >= ${ZERO} AND x <= ${MAX_DIMENSION} AND y <= ${bottom} )`

        // Quadrant 3   (topright)
        result += ` OR(x >= ${ZERO} AND y >= ${top} AND x <= ${right} AND y <= ${MAX_DIMENSION} )`

        // Quadrant 4   (bottomright) -> THIS IS THE "NORMAL"
        result += ` OR(x >= ${ZERO} AND y >= ${ZERO} AND x <= ${right} AND y <= ${bottom} )`
    } else if (xWraps) {
        // Quadrant 2   (bottomleft)
        result += ` OR(x >= ${left} AND y >= ${ZERO} AND x <= ${MAX_DIMENSION} AND y <= ${bottom} )`

        // Quadrant 4   (bottomright) -> THIS IS THE "NORMAL"
        result += ` OR(x >= ${ZERO} AND y >= ${ZERO} AND x <= ${right} AND y <= ${bottom} )`
    } else if (yWraps) {
        // Quadrant 3   (topright)
        result += ` OR(x >= ${ZERO} AND y >= ${top} AND x <= ${right} AND y <= ${MAX_DIMENSION} )`

        // Quadrant 4   (bottomright) -> THIS IS THE "NORMAL"
        result += ` OR(x >= ${ZERO} AND y >= ${ZERO} AND x <= ${right} AND y <= ${bottom} )`
    } else {
        // Quadrant 4   (bottomright) -> THIS IS THE "NORMAL"
        result += ` OR(x >= ${top} AND y >= ${bottom} AND x <= ${right} AND y <= ${bottom} )`
    }
    result += ";"

    return result
}

export function useDojoSqlPixelStore(sdk: SDK<SchemaType>): PixelStore {
    const state = useRef<State>({}).current;
    const [queryBounds, setQueryBounds] = useState<Bounds | null>(null)
    const [cacheUpdated, setCacheUpdated] = useState<number>(Date.now())
    const isSubscribed = useRef(false)

    useEffect(() => {
        if (isSubscribed.current) return

        let unsubscribe: (() => void) | undefined

        const subscribe = async () => {
            const subscription = await sdk.subscribeEntityQuery({
                query: SUBSCRIPTION_QUERY,
                callback: (response) => {
                    if (response.error) {
                        console.error("Error setting up entity sync:", response.error)
                    } else if (response.data && response.data[0].entityId !== "0x0") {
                        console.log("callback", response.data[0])
                        const p = response.data[0].models.pixelaw.Pixel

                        const key = `${p?.x}_${p?.y}`
                        setPixel(key, p as Pixel)
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
    }, [sdk])

    useEffect(() => {
        if (queryBounds) {
            refresh()
        }
    }, [queryBounds])

    
    const refresh = (): void => {
        if (!queryBounds) return

        const query = encodeURIComponent(createSqlQuery(queryBounds))

        fetch(`http://localhost:8080/sql?query=${query}`, {})
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`)
                }
                response
                    .json()
                    .then((json) => {
                        const pixelItems = json.map((p) => {
                            const x = p.v >> 16
                            const y = p.v & 0xffff

                            const pixel = { color: p.c, x, y, text: p.t } as Pixel
                            return { key: `${x}_${y}`, pixel }
                        })

                        setPixels(pixelItems)
                    })
                    .catch((e) => {
                        console.error("error parsing json", e)
                    })
            })
            .catch((error) => {
                console.log("neee", error)
            })
    }

    const prepare = (newBounds: Bounds): void => {
        const newQueryBounds = getQueryBounds(newBounds)

        if (!queryBounds || !areBoundsEqual(queryBounds, newQueryBounds)) {
            // console.log("prep/setB", newQueryBounds)
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
