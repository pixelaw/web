import {Bounds, MAX_DIMENSION} from "@/webtools/types.ts";
import {MAX_VIEW_SIZE} from "@/webtools/utils.ts";

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
