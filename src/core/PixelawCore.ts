import { DojoEngine } from "@/core/dojo/DojoEngine.ts"
import { MudEngine } from "@/core/mud/MudEngine.ts"
import type { CoreStatus, Engine, EngineConstructor, PixelCoreEvents, WorldConfig } from "@/core/types.ts"
import ViewPort, { type Viewport } from "@/webtools/components/Viewport/ViewPort"
import type { PixelStore } from "@/webtools/types/PixelStore.types"
import type { TileStore } from "@/webtools/types/types.ts"
import mitt from "mitt"

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
    viewPort: Viewport = null!
    events = mitt<PixelCoreEvents>()

    async loadWorld(worldConfig: WorldConfig) {
        if (this.worldConfig && JSON.stringify(this.worldConfig) === JSON.stringify(worldConfig)) {
            console.log("Configuration already loaded.")
            return
        }

        this.updateStatus("loading")
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

        this.viewPort = new ViewPort(this.events, this.tileStore, this.pixelStore)

        this.updateStatus("ready")
    }

    private updateStatus(newStatus: CoreStatus) {
        this.status = newStatus
        this.events.emit("statusChange", newStatus)
    }
}
