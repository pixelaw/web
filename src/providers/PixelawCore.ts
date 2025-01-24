import type { DojoConfig, DojoEngineConfig, EngineConfig, MudEngineConfig, WorldConfig } from "@/global/world.types";
import type { PixelStore } from "@/webtools/types/PixelStore.types";
import worlds from "@/config/worlds.json";
import { schema, type SchemaType } from "@/generated/models.gen.ts";
import { DojoProvider } from "@dojoengine/core";
import {
    fetchAppsAndManifest,
    setupControllerConnector,
    setupBurnerConnector,
    type DojoStuff,
} from "@/stores/DojoStore";
import { init } from "@dojoengine/sdk";
import { DEFAULT_WORLD } from "@/global/constants";
import useSettingStore from "@/stores/SettingStore";
import { _Viewport } from "@/webtools/components/Viewport/ViewPort";
import DojoSqlPixelStore from "@/stores/DojoSqlPixelStore";
import { EventEmitter, type PixelcoreEvents } from "@/global/events";
import mitt from "mitt";

export type InteractHandler = {
    hoi: string;
};

type TEngineStatus = "ready" | "loading" | "error" | "uninitialized";
type TCoreStatus = "ready" | "loading" | "error" | "uninitialized";

export interface Engine {
    interacthandler: InteractHandler;
    pixelStore: PixelStore;
    status: TEngineStatus;

    init(engineConfig: EngineConfig): Promise<PixelStore>;
}

export class MudEngine implements Engine {
    interacthandler: InteractHandler = null!;
    pixelStore: PixelStore = null!;
    status: TEngineStatus = "uninitialized";

    async init(engineConfig: EngineConfig): Promise<PixelStore> {
        const config = engineConfig as MudEngineConfig;
        console.log("ooppp mud", config, this.constructor["name"]);
    }
}

export class DojoEngine implements Engine {
    interacthandler: InteractHandler = null!;
    pixelStore: PixelStore = null!;
    status: TEngineStatus = "uninitialized";
    worldConfig: DojoConfig = null!;
    dojoSetup: DojoStuff | null = null;

    async init(engineConfig: EngineConfig) {
        const config = engineConfig as DojoEngineConfig;
        console.log("ooppp dojo", config, this.constructor["name"]);
        this.worldConfig = config.dojoConfig;
        try {
            await this.dojoInit();
        } catch (error) {
            console.error("Dojo init error:", error);
        }
        console.log(this.status, this.dojoSetup);
        return await this.setupPixelStore();
    }

    async dojoInit() {
        this.status = "loading";
        const { worldConfig } = this;
        if (!worldConfig) {
            throw new Error("WorldConfig is not loaded");
        }
        try {
            console.log("init", worldConfig, schema);
            const sdkSetup = {
                client: {
                    rpcUrl: worldConfig.rpcUrl,
                    toriiUrl: worldConfig.toriiUrl,
                    relayUrl: "",
                    worldAddress: worldConfig.world,
                },
                domain: {
                    name: "pixelaw",
                    version: "1.0",
                    chainId: "KATANA",
                    revision: "1",
                },
            };
            console.log("sdkSetup", sdkSetup);
            const sdk = await init<SchemaType>(sdkSetup, schema);
            console.log("sdk", sdk);
            const { apps, manifest } = await fetchAppsAndManifest(worldConfig);
            console.log("apps", apps);
            const provider = new DojoProvider(manifest, worldConfig.rpcUrl);
            console.log("provider", provider);
            const controllerConnector = setupControllerConnector(manifest, worldConfig);
            console.log("controllerConnector", controllerConnector);
            const burnerConnector = await setupBurnerConnector(provider, worldConfig);
            console.log("burnerConnector", burnerConnector);
            this.dojoSetup = {
                sdk,
                controllerConnector,
                apps,
                manifest,
                burnerConnector,
                provider,
            };
            this.status = "ready";
            return this.dojoSetup;
        } catch (error) {
            console.error("Initialization error:", error);
            this.status = "error";
        }
    }

    async setupPixelStore(): Promise<PixelStore> {
        if (!this.dojoSetup) {
            throw new Error("DojoSetup is not loaded");
        }
        const store = new DojoSqlPixelStore(this.dojoSetup.sdk!);
        await store.refresh();
        this.pixelStore = store as PixelStore;
        return this.pixelStore;
    }
}

type EngineConstructor<T extends Engine> = new () => T;

export const supportedEngines: [string, EngineConstructor<Engine>][] = [
    ["dojo", DojoEngine],
    ["mud", MudEngine],
];

export class PixelawCore {
    status: TCoreStatus = "uninitialized";
    engineConfig: EngineConfig = null!;
    worldConfig: WorldConfig = null!;
    engine: Engine = null!;
    currentWorld = DEFAULT_WORLD;
    pixelStore: PixelStore = null!;
    viewPort: _Viewport = null!;
    events = mitt<PixelcoreEvents>();

    async loadWorld(worldConfig: WorldConfig) {
        this.status = "loading";
        this.worldConfig = worldConfig;
        // @dev here we are selecting the correct engine for config type from our supported engines
        const engine = supportedEngines.find(([engineName]) => engineName === worldConfig.config.engine);
        if (!engine) {
            throw new Error(`Unsupported engine: ${worldConfig.config.engine}`);
        }
        const [, engineClass] = engine;
        this.engine = new engineClass();
        this.pixelStore = await this.engine.init(worldConfig.config);
        this.viewPort = new _Viewport();
        this.viewPort.init("CONMTAINER???", this.pixelStore, "TILESTORE");
        this.status = "ready";
    }
}

export const Main = async () => {
    const settings = useSettingStore.getState();
    const allWorlds = worlds;
    const core = new PixelawCore();
    console.log(settings);
    const jsonWorld = Object.entries(allWorlds).find(([key]) => key === settings.world);
    const config = { config: jsonWorld[1], name: jsonWorld[0] };
    console.log(config);
    core.loadWorld(config);
    // for (const worldConfig of Object.entries(allWorlds)) {
    //     core.loadWorld({ config: worldConfig[1], name: worldConfig[0] });
    //     return;
    // }
};
