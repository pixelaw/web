import { DojoEngine } from "./engines/dojo/DojoEngine.ts"
import { MudEngine } from "./engines/mud/MudEngine.ts"
import type { PixelStore } from "./types.ts"
import type { CoreStatus, Engine, EngineConstructor, PixelCoreEvents, WorldConfig } from "./types.ts"

import mitt from "mitt"
import { Canvas2DRenderer } from "./renderers"
import type { AppStore, TileStore } from "./types.ts"

export const supportedEngines: [string, EngineConstructor<Engine>][] = [
    ["dojo", DojoEngine],
    ["mud", MudEngine],
]

export class PixelawCore {
    status: CoreStatus = "uninitialized"
    worldConfig: WorldConfig = null!
    engine: Engine = null!
    pixelStore: PixelStore = null!
    tileStore: TileStore = null!
    appStore: AppStore = null!
    viewPort: Canvas2DRenderer = null!
    events = mitt<PixelCoreEvents>()

    // TODO add Query(string) manager that allows safe read/write to the zoom/world etc.
    // TODO Wallets?

    async loadWorld(worldConfig: WorldConfig) {
        if (this.worldConfig && JSON.stringify(this.worldConfig) === JSON.stringify(worldConfig)) {
            console.log("Configuration already loaded.")
            return
        }

        this.updateStatus("loadConfig")
        this.worldConfig = worldConfig

        const engine = supportedEngines.find(([engineName]) => engineName === worldConfig.engine)
        if (!engine) {
            throw new Error(`Unsupported engine: ${worldConfig.engine}`)
        }
        const [, engineClass] = engine
        this.engine = new engineClass()

        this.updateStatus("initializing")

        await this.engine.init(worldConfig.config)

        this.pixelStore = this.engine.pixelStore
        this.tileStore = this.engine.tileStore
        this.appStore = this.engine.appStore

        this.viewPort = new Canvas2DRenderer(this.events, this.tileStore, this.pixelStore)

        this.updateStatus("ready")
    }

    // TODO url stuff here, not in GamePage

    private updateStatus(newStatus: CoreStatus) {
        this.status = newStatus
        this.events.emit("statusChange", newStatus)
    }
}
