import type { Bounds, Pixel } from "@/webtools/types/types.ts"
import mitt from "mitt"

type Events = {
    "pixelUpdated": { pixel: Pixel },
    "userScrolled": { bounds: Bounds },
    "userZoomed": { bounds: Bounds },
}

export const EventEmitter = mitt<Events>()
