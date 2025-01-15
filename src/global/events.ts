import type { Bounds, Pixel } from "@/webtools/types"
import mitt from "mitt"

type Events = {
    "pixelUpdated": { pixel: Pixel },
    "userScrolled": { bounds: Bounds },
    "userZoomed": { bounds: Bounds },
}

export const EventEmitter = mitt<Events>()
