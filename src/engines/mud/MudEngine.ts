import type { PixelStore } from "@/PixelStore.types.ts"
import type { MudConfig } from "../types.ts"

import type { DojoStuff } from "@/engines/dojo/DojoEngineInit.ts"
import type { DojoConfig, EngineStatus } from "@/types.ts"
import type { Engine, InteractHandler } from "@/types.ts"
import type { AppStore, TileStore, UpdateService } from "@/types.ts"

export class MudEngine implements Engine {
    interacthandler: InteractHandler = null!
    pixelStore: PixelStore = null!
    tileStore: TileStore = null!
    appStore: AppStore = null!
    updateService: UpdateService = null!
    status: EngineStatus = "uninitialized"
    config: DojoConfig = null!
    dojoSetup: DojoStuff | null = null

    async init(config: MudConfig) {
        console.log("ooppp mud", config, this.constructor.name)
    }
}
