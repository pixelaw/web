import useSettingStore, { WorldConfig} from "@/stores/SettingStore.ts"
import { DojoProvider} from "@dojoengine/core"
import { type ReactNode, createContext, useCallback, useContext, useEffect,  useState } from "react"
import {Account, RpcProvider} from "starknet";
import type {Manifest} from "@/global/types.js";
import {fetchApps} from "@/stores/DojoAppStore.js";
import {getAbi} from "@/dojo/utils.js";
import baseManifest  from "@/dojo/manifest.js";
import {BurnerManager} from "@dojoengine/create-burner";
import {init, SDK} from "@dojoengine/sdk";
import {schema, SchemaType} from "@/generated/models.gen.ts";
import {DEFAULT_WORLD} from "@/global/constants.ts";

export type DojoStuff = {
    sdk:  SDK<SchemaType>
    dojoProvider: DojoProvider
    manifest: Manifest
    burnerManager: BurnerManager | null
    userAccount: Account | undefined
}

export type IPixelawContext = {
    world: string
    walletType: "argent" | "braavos" | "burner" | "controller" | undefined
    clientState: "worldSelect" | "loading" | "error" | "gameActive"
    clientError: Error | string | null
    dojoStuff: DojoStuff | undefined
    worldStuff: WorldConfig
    setWorld: (world: string) => void;

}

export const PixelawContext = createContext<IPixelawContext | undefined>(undefined);


// @dev createDojoConfig can only be called once, or we get a full hangup
let activeLoad = false

export const PixelawProvider = ({ children }: { children: ReactNode }) => {

    const { worldsConfig, getWorldByKey } = useSettingStore();

    const [contextValues, setContextValues] = useState<IPixelawContext>({
        world: DEFAULT_WORLD,
        walletType: "burner",
        clientState: "loading",
        clientError: null,
        dojoStuff: undefined,
        worldStuff: getWorldByKey(DEFAULT_WORLD),
        setWorld: () => {},
    });


    const setupDojo = useCallback(async () => {
        if (activeLoad) return;
        activeLoad = true;

        try {
            let burnerManager: BurnerManager
            let userAccount: Account

            const deployment = getWorldByKey(contextValues.world)

            const apps = await fetchApps(deployment.toriiUrl)



            const contracts = await Promise.all(
                apps.map((address) => getAbi(new RpcProvider({ nodeUrl: deployment.rpcUrl }), address)),
            )

            // Manifest with updated contract ABIs
            const manifest = {
                ...baseManifest(deployment.world),
                contracts,
            } as unknown as Manifest

            const dojoProvider = new DojoProvider(manifest, deployment.rpcUrl)


            console.log("here")
            if(contextValues.walletType == "burner"){
                if(!deployment.burner) throw Error("Burner config not defined")

                // Create burner manager
                burnerManager = new BurnerManager({
                    ...deployment.burner,
                    rpcProvider: dojoProvider.provider,
                    masterAccount: new Account(dojoProvider.provider, deployment.burner.masterAddress, deployment.burner.masterPrivateKey)
                })

                await burnerManager.init()
                if (burnerManager.list().length === 0) {
                    try {
                        await burnerManager.create()
                        console.log("burner done")
                    } catch (e) {
                        console.error(e)
                    }
                }

                const { account, /*create, list, get, select, clear,  isDeploying */} = burnerManager
                userAccount = account!
            }

            // Create Graph SDK TODO
            // const _createGraphSdk = () => getSdk(new GraphQLClient(`${deployment.toriiUrl}/graphql`))
            console.log(deployment)
            const sdk = await init<SchemaType>(
                {
                    client: {
                        rpcUrl: deployment.rpcUrl,
                        toriiUrl: deployment.toriiUrl,
                        relayUrl: "", //deployment.relayUrl,
                        worldAddress: deployment.world,
                    },
                    domain: {
                        name: "pixelaw",
                        version: "1.0",
                        chainId: "KATANA",
                        revision: "1",
                    },
                },
                schema
            );

            setContextValues((prev) => ({
                ...prev,
                clientState: "gameActive",
                clientError: null,
            dojoStuff: {
                sdk,
                dojoProvider,
                manifest,
                burnerManager,
                userAccount
            }
            }));

        } catch (e) {
            setContextValues((prev) => ({
                ...prev,
                clientState: "error",
                clientError: e as Error,
            }));
        } finally {
            activeLoad = false;
        }
    }, [worldsConfig]);

    useEffect(() => {
        if (worldsConfig && contextValues.world) {
            setupDojo();
        }
    }, [worldsConfig]);


    return <PixelawContext.Provider value={contextValues}>{children}</PixelawContext.Provider>
}

export const usePixelawProvider = (): IPixelawContext => {
    const context = useContext(PixelawContext)
    if (!context) throw new Error("PixelLawProvider can only be used within a PixelLawProvider")
    return context
}
