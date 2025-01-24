
import type { PixelStore } from "@/webtools/types/PixelStore.types";
import ViewPort, { Viewport } from "@/webtools/components/Viewport/ViewPort";
import {Engine, EngineConstructor, PixelCoreEvents, CoreStatus, WorldConfig, EngineConfig} from "@/core/types.ts";
import mitt from "mitt";
import {DojoEngine} from "@/core/dojo/DojoEngine.ts";
import {MudEngine} from "@/core/mud/MudEngine.ts";
import {TileStore} from "@/webtools/types/types.ts";


export const supportedEngines: [string, EngineConstructor<Engine>][] = [
    ["dojo", DojoEngine],
    ["mud", MudEngine],
];

export class PixelawCore {
    status: CoreStatus = "uninitialized";
    worldConfig: WorldConfig = null!;
    engine: Engine = null!;
    pixelStore: PixelStore = null!;
    tileStore: TileStore = null!;
    viewPort: Viewport = null!;
    events = mitt<PixelCoreEvents>();

    async loadWorld(worldConfig: WorldConfig) {
        this.status = "loading";
        this.worldConfig = worldConfig;


        const engine = supportedEngines.find(([engineName]) => engineName === worldConfig.engine);
        if (!engine) {
            throw new Error(`Unsupported engine: ${worldConfig.engine}`);
        }
        const [, engineClass] = engine;
        this.engine = new engineClass();
        await this.engine.init(worldConfig.config);

        this.pixelStore = this.engine.pixelStore
        this.tileStore = this.engine.tileStore

        // this.viewPort = new ViewPort();
        // this.viewPort.init("CONMTAINER???", this.pixelStore, "TILESTORE");
        this.status = "ready";
    }
}
