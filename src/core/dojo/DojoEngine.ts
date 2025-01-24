import type {PixelStore} from "@/webtools/types/PixelStore.types.ts";

import DojoSqlPixelStore from "@/core/dojo/DojoSqlPixelStore.ts";


import {InteractHandler, EngineStatus, Engine, DojoConfig} from "@/core/types.ts";
import {dojoInit, DojoStuff, setupPixelStore, setupTileStore} from "@/core/dojo/DojoEngineInit.ts";
import {schema, type SchemaType} from "@/generated/models.gen.ts";
import {RestTileStore} from "@/core/RestTileStore.ts";
import {TileStore} from "@/webtools/types/types.ts";
import type {SDK} from "@dojoengine/sdk";

export class DojoEngine implements Engine {
    interacthandler: InteractHandler = null!;
    pixelStore: PixelStore = null!;
    tileStore: TileStore = null!;
    status: EngineStatus = "uninitialized";
    config: DojoConfig = null!;
    dojoSetup: DojoStuff | null = null;

    async init(config: DojoConfig) {

        this.config = config;
        try {
            // Setup Dojo
            this.dojoSetup = await dojoInit(this.config, schema);
            this.status = this.dojoSetup ? "ready" : "error";

            // Setup PixelStore
            this.pixelStore = await setupPixelStore(this.dojoSetup!.sdk!);

            // TODO Setup UpdateService

            // Setup TileStore
            this.tileStore = await setupTileStore(config.serverUrl);

            // TODO Setup InteractHandler
            // TODO Setup ViewPort

        } catch (error) {
            console.error("Dojo init error:", error);
        }
        console.log(this.status, this.dojoSetup);
    }




}
