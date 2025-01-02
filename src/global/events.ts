import type { Pixel } from "@/generated/models.gen"
import mitt from "mitt"

type Events = {
    "pixelUpdated": { pixel: Pixel }
}

export const EventEmitter = mitt<Events>()
