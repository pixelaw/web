import type {PixelStore} from "@/webtools/types/PixelStore.types.ts";
import type {EngineConfig, MudEngineConfig} from "./types.ts";

import {EngineStatus} from "@/core/types.ts";
import {Engine, InteractHandler} from "@/core/types.ts";

export class MudEngine implements Engine {
    interacthandler: InteractHandler = null!;
    pixelStore: PixelStore = null!;
    status: EngineStatus = "uninitialized";

    async init(engineConfig: EngineConfig) {
        const config = engineConfig as MudEngineConfig;
        console.log("ooppp mud", config, this.constructor["name"]);

    }
}
