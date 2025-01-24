import type {Bounds, Pixel, TileStore} from "@/webtools/types/types.ts"
import mitt from "mitt"
import type {PixelStore} from "@/webtools/types/PixelStore.types.ts";


export type PixelCoreEvents = {
    "pixelUpdated": { pixel: Pixel },
    "userScrolled": { bounds: Bounds },
    "userZoomed": { bounds: Bounds },
}

export const EventEmitter = mitt<PixelCoreEvents>()

export type InteractHandler = {
    hoi: string;
};

export type EngineStatus = "ready" | "loading" | "error" | "uninitialized";
export type CoreStatus = "ready" | "loading" | "error" | "uninitialized";

export interface Engine {
    interacthandler: InteractHandler;
    pixelStore: PixelStore;
    tileStore: TileStore;
    status: EngineStatus;

    init(engineConfig: EngineConfig): Promise<void>;
}

export type EngineConstructor<T extends Engine> = new () => T;

export interface WalletConfig {
    masterAddress?: string;
    masterPrivateKey?: string;
    accountClassHash?: string;
    rpcUrl?: string;
    profileUrl?: string;
    url?: string;
}

export interface DojoConfig {
    serverUrl: string;
    rpcUrl: string;
    toriiUrl: string;
    relayUrl: string;
    feeTokenAddress: string;
    wallets: {
        burner?: WalletConfig;
        controller?: WalletConfig;
    };
    world: string;
}


export interface MudConfig {
    // TODO
}

export interface DojoEngineConfig {
    engine: "dojo";
    description: string;
    dojoConfig: DojoConfig;
}

export interface MudEngineConfig {
    engine: "mud";
    description: string;
    mudConfig: MudConfig;
}

export type EngineConfig = DojoConfig | MudConfig;

export interface DojoWorldConfig {
    engine: "dojo";
    description: string;
    config: DojoConfig;
}

export interface MudWorldConfig {
    engine: "mud";
    description: string;
    config: MudConfig;
}

export type WorldConfig = DojoWorldConfig | MudWorldConfig;
//
// {
//     "WORLD_ID": {
//         "engine": "dojo",
//         "config": {
//             "dojoField1": "val1"
//         }
//     },
//     "WORLD_ID_OTHER": {
//         "engine": "mud",
//         "config": {
//             "mudfield1": "val1"
//         }
//     }
// }