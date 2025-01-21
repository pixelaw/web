
type PixelawEngine = {
  type: string;
  config: unknown;
}

type MudEngineType = PixelawEngine & {
  config: {
    serverUrl: string;
    world: string
  }
}

type DojoEngineType = PixelawEngine & {
  config: {
    toriiUrl: string;
    serverUrl: string;
    rpcUrl: string;
    relayUrl: string;
    world: string;
    wallets: {
      burner: {
        masterAddress: string;
        masterPrivateKey: string;
        accountClassHash: string;
      };
      controller: {
        rpcUrl: string;
        profileUrl: string;
        url: string;
      };
    };
  }
}


type PixelawConfig = {
  engine: PixelawEngine;
  description: string;
}

const DojoConfig: DojoEngineType = {
  type: "Dojo",
  config: {
    toriiUrl: "http://127.0.0.1:8080",
    serverUrl: "http://127.0.0.1:3000",
    rpcUrl: "http://127.0.0.1:5050",
    relayUrl: "http://127.0.0.1:8080",
    world: "0x1869796b1c25976fc5f4b08ca84995945aa68a8850d3739c96e4c9994456ed7",
    wallets: {
      burner: {
        masterAddress: "0x127fd5f1fe78a71f8bcd1fec63e3fe2f0486b6ecd5c86a0466c3a21fa5cfcec",
        masterPrivateKey: "0xc5b2fcab997346f3ea1c00b002ecf6f382c5f9c9659a3894eb783c5320f912",
        accountClassHash: "0x07dc7899aa655b0aae51eadff6d801a58e97dd99cf4666ee59e704249e51adf2"
      },
      controller: {
        rpcUrl: "https://api.cartridge.gg/x/starknet/mainnet",
        profileUrl: "https://api.cartridge.gg/x/starknet/mainnet",
        url: "https://api.cartridge.gg/x/starknet/mainnet"
      }
    }
  },
}

export const localEmpty: PixelawConfig = {
  description: "dude",
  engine: DojoConfig
}