import type { MudConfig, PixelStore } from "@/types.ts"

import { DojoInteraction } from "@/engines/dojo/DojoInteraction.ts"
import type { App, DojoConfig, EngineStatus, Interaction, Pixel } from "@/types.ts"
import type { Engine } from "@/types.ts"
import type { AppStore, TileStore, UpdateService } from "@/types.ts"

export class MudEngine implements Engine {
    pixelStore: PixelStore = null!
    tileStore: TileStore = null!
    appStore: AppStore = null!
    updateService: UpdateService = null!
    status: EngineStatus = "uninitialized"
    config: DojoConfig = null!

    async init(config: MudConfig) {
        console.log("ooppp mud", config, this.constructor.name)
    }

    // biome-ignore lint/correctness/noUnusedVariables: TODO
    getInteraction(app: App, pixel: Pixel): Interaction {
        return new DojoInteraction()
        // TODO app has plugin
        // TODO determine function
        // TODO determine arguments
        // TODO build dialog
        // TODO populate actions
        // pixel
        // app
        // engine.manifest
        // engine.account?
    }
}
