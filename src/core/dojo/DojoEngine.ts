import { RestTileStore } from "@/core/common/RestTileStore.ts"
import { WsUpdateService } from "@/core/common/WsUpdateService.ts"
import { type DojoStuff, dojoInit } from "@/core/dojo/DojoEngineInit.ts"
import DojoSqlPixelStore from "@/core/dojo/DojoSqlPixelStore.ts"
import type { DojoConfig, Engine, EngineStatus, InteractHandler } from "@/core/types.ts"
import { schema } from "@/generated/models.gen.ts"
import type { PixelStore } from "@/webtools/types/PixelStore.types.ts"
import type { TileStore, UpdateService } from "@/webtools/types/types.ts"

export class DojoEngine implements Engine {
    interacthandler: InteractHandler = null!
    pixelStore: PixelStore = null!
    tileStore: TileStore = null!
    updateService: UpdateService = null!
    status: EngineStatus = "uninitialized"
    config: DojoConfig = null!
    dojoSetup: DojoStuff | null = null

    async init(config: DojoConfig) {
        this.config = config
        try {
            // Setup Dojo
            this.dojoSetup = await dojoInit(this.config, schema)
            this.status = this.dojoSetup ? "ready" : "error"

            // Setup PixelStore
            this.pixelStore = new DojoSqlPixelStore(this.dojoSetup!.sdk!)

            // Setup UpdateService
            this.updateService = new WsUpdateService(config.serverUrl)

            // Setup TileStore
            this.tileStore = new RestTileStore(config.serverUrl)

            // TODO Setup InteractHandler
            // TODO Setup ViewPort
        } catch (error) {
            console.error("Dojo init error:", error)
        }
        console.log(this.status, this.dojoSetup)
    }
}
