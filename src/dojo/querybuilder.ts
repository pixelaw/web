import {Bounds, MAX_DIMENSION, QUERY_BUFFER} from "@/webtools/types.ts";
import {MAX_VIEW_SIZE} from "@/webtools/utils.ts";


export function getQueryBounds(viewBounds: Bounds): Bounds{
    let [[left, top], [right, bottom]] = viewBounds;
    let l=0, t=0, r=0, b=0

    if (left < QUERY_BUFFER) {
        l = MAX_DIMENSION + 1 - QUERY_BUFFER
    }else{
        l = left - (left % QUERY_BUFFER)
    }

    if (top < QUERY_BUFFER) {
        t = MAX_DIMENSION + 1 - QUERY_BUFFER
    }else{
        t = top - (top % QUERY_BUFFER)
    }

    if (right > MAX_DIMENSION - QUERY_BUFFER +1) {
        r = 0
    }else{
        r = right + (QUERY_BUFFER - right % QUERY_BUFFER)
    }

    if (bottom > MAX_DIMENSION - QUERY_BUFFER +1) {
        b = 0
    }else{
        b = bottom + (QUERY_BUFFER - bottom % QUERY_BUFFER)
    }

    return [[l,t],[r,b]]
}

export const SUBSCRIPTION_QUERY ={
    pixelaw: {
        Pixel: {
            $: {
                where: {
                    And: [
                        { x: { $gte: 0 } },
                        { y: { $gte: 0 } },
                        { x: { $lte: MAX_DIMENSION } },
                        { y: { $lte: MAX_DIMENSION } },
                    ],
                },

            },
        },
    },
};

export function buildPixelQuery(bounds: Bounds) {
    let [[left, top], [right, bottom]] = bounds;

    if (left > MAX_VIEW_SIZE && left > right) right = MAX_DIMENSION;
    if (top > MAX_VIEW_SIZE && top > bottom) bottom = MAX_DIMENSION;

    const xWraps = right - left < 0;
    const yWraps = bottom - top < 0;

    let query;

    if (xWraps && yWraps) {
        query = {
            pixelaw: {
                Pixel: {
                    $: {
                        where: {
                            Or: [
                                {
                                    And: [
                                        { x: { $gte: left } },
                                        { y: { $gte: top } },
                                        { x: { $lte: 0 } },
                                        { y: { $lte: 0 } },
                                    ],
                                },
                                {
                                    And: [
                                        { x: { $gte: left } },
                                        { y: { $gte: 0 } },
                                        { x: { $lte: 0 } },
                                        { y: { $lte: bottom } },
                                    ],
                                },
                                {
                                    And: [
                                        { x: { $gte: 0 } },
                                        { y: { $gte: top } },
                                        { x: { $lte: right } },
                                        { y: { $lte: 0 } },
                                    ],
                                },
                                {
                                    And: [
                                        { x: { $gte: 0 } },
                                        { y: { $gte: 0 } },
                                        { x: { $lte: right } },
                                        { y: { $lte: bottom } },
                                    ],
                                },
                            ],
                        },
                    },
                },
            },
        };
    } else if (xWraps) {
        query = {
            pixelaw: {
                Pixel: {
                    $: {
                        where: {
                            Or: [
                                {
                                    And: [
                                        { x: { $gte: left } },
                                        { y: { $gte: top } },
                                        { x: { $lte: 0 } },
                                        { y: { $lte: bottom } },
                                    ],
                                },
                                {
                                    And: [
                                        { x: { $gte: 0 } },
                                        { y: { $gte: top } },
                                        { x: { $lte: right } },
                                        { y: { $lte: bottom } },
                                    ],
                                },
                            ],
                        },
                    },
                },
            },
        };
    } else if (yWraps) {
        query = {
            pixelaw: {
                Pixel: {
                    $: {
                        where: {
                            Or: [
                                {
                                    And: [
                                        { x: { $gte: left } },
                                        { y: { $gte: top } },
                                        { x: { $lte: right } },
                                        { y: { $lte: 0 } },
                                    ],
                                },
                                {
                                    And: [
                                        { x: { $gte: left } },
                                        { y: { $gte: 0 } },
                                        { x: { $lte: right } },
                                        { y: { $lte: bottom } },
                                    ],
                                },
                            ],
                        },
                    },
                },
            },
        };
    } else {
        query = {
            pixelaw: {
                Pixel: {
                    $: {
                        where: {
                            And: [
                                { x: { $gte: left } },
                                { y: { $gte: top } },
                                { x: { $lte: right } },
                                { y: { $lte: bottom } },
                            ],
                        },
                    },
                },
            },
        };
    }
    return query;
}
