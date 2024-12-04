import GET_PIXELS_QUERY from "@/../graphql/GetPixels.graphql"
import { type Bounds, type Coordinate, MAX_DIMENSION, type Pixel, type PixelStore, makeString } from "@/webtools/types.ts"
import { MAX_VIEW_SIZE, areBoundsEqual } from "@/webtools/utils.ts"
import { GraphQLClient } from "graphql-request"
import { produce } from "immer"
import { useState } from "react"
import { shortString } from "starknet"

// TODO local declaration to deal with typing. Should come from World__Query but thats very generic
type GetPixelsResponse = {
    pixelawPixelModels: {
        edges: Array<{
            node: Pixel
        }>
    }
}

type State = { [key: string]: Pixel | undefined }

export function useDojoPixelStore(baseUrl?: string): PixelStore {
    const [state, setState] = useState<State>({})
    const [bounds, setBounds] = useState<Bounds>([
        [0, 0],
        [1, 1], // TODO need better defaults?
    ])
    const [cacheUpdated, setCacheUpdated] = useState<number>(Date.now())

    const gqlClient = baseUrl ? new GraphQLClient(`${baseUrl}/graphql`) : null

    function fetchData(bounds: Bounds): void {
        if (!gqlClient) return

        let [[left, top], [right, bottom]] = bounds

        if (left > MAX_VIEW_SIZE && left > right) right = MAX_DIMENSION
        if (top > MAX_VIEW_SIZE && top > bottom) bottom = MAX_DIMENSION

        gqlClient
            .request<GetPixelsResponse>(GET_PIXELS_QUERY, {
                first: 50000,
                where: {
                    xGTE: left,
                    xLTE: right,
                    yGTE: top,
                    yLTE: bottom,
                },
            })
            .then((data) => {
                data?.pixelawPixelModels?.edges?.map(({ node }: { node: Pixel }) => {
                    const pixel: Pixel = {
                        ...node,
                        text: shortString.decodeShortString(node.text),
                        action: shortString.decodeShortString(node.action),
                        timestamp: Number.parseInt(node.timestamp as string, 16),
                    }

                    setState(
                        produce((draftState) => {
                            draftState[`${node.x}_${node.y}`] = pixel
                        }),
                    )
                })
                setCacheUpdated(Date.now())
            })
            .catch((e) => {
                console.error("Error retrieving pixels from torii for", bounds, e.message)
            })
    }

    const refresh = (): void => {
        const [[left, top], [right, bottom]] = bounds
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
        if (!areBoundsEqual(bounds, newBounds)) {
            setBounds(newBounds)
            refresh()
        }
    }

    const getPixel = (coord: Coordinate): Pixel | undefined => {
        const key = `${coord[0]}_${coord[1]}`

        return state[key]
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
            }
        } else {
            pixel = {
                ...pixel,
                color,
            }
        }

        setState(
            produce((draft) => {
                draft[key] = pixel
            }),
        )
    }

    const setPixel = (key: string, pixel: Pixel): void => {
        setState(
            produce((draft) => {
                draft[key] = pixel
            }),
        )
    }

    const setPixels = (pixels: { key: string; pixel: Pixel }[]): void => {
        setState(
            produce((draft) => {
                for (const { key, pixel } of pixels) {
                    draft[key] = pixel
                }
            }),
        )
    }

    return { getPixel, setPixel, setPixelColor, setPixels, prepare, refresh, setCacheUpdated, cacheUpdated }
}
