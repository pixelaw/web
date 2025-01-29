import { RestTileStore } from "@/common/RestTileStore.ts"
import { WsUpdateService } from "@/common/WsUpdateService.ts"
import { type DojoStuff, dojoInit } from "@/engines/dojo/DojoEngine.init.ts"
import DojoSqlPixelStore from "@/engines/dojo/DojoSqlPixelStore.ts"
import { schema } from "@/engines/dojo/generated/models.gen.ts"
import type { DojoConfig, Engine, EngineStatus, InteractHandler } from "@/types.ts"
import type { PixelStore } from "@/types.ts"
import type { AppStore, TileStore, UpdateService } from "@/types.ts"
import type { Connector } from "@starknet-react/core"
import { DojoAppStore } from "./DojoAppStore.ts"

export class DojoEngine implements Engine {
    interacthandler: InteractHandler = null!
    pixelStore: PixelStore = null!
    tileStore: TileStore = null!
    appStore: AppStore = null!
    updateService: UpdateService = null!
    status: EngineStatus = "uninitialized"
    config: DojoConfig = null!
    dojoSetup: DojoStuff | null = null
    walletConnectors: Connector[]

    async init(config: DojoConfig) {
        this.config = config
        try {
            // Setup Dojo
            this.dojoSetup = await dojoInit(this.config, schema)
            this.status = this.dojoSetup ? "ready" : "error"

            // Setup AppStore
            this.appStore = new DojoAppStore(this.dojoSetup)

            // Setup PixelStore
            this.pixelStore = new DojoSqlPixelStore(this.dojoSetup!.sdk!)

            // Setup UpdateService
            this.updateService = new WsUpdateService(config.serverUrl)

            // Setup TileStore
            this.tileStore = new RestTileStore(config.serverUrl)

            // Setup WalletConnectors

            // TODO Setup InteractHandler
        } catch (error) {
            console.error("Dojo init error:", error)
        }
        console.log(this.status, this.dojoSetup)
    }
}
