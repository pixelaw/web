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

export type EngineConfig = DojoEngineConfig | MudEngineConfig;

