import { BurnerAccount, useBurnerManager } from "@dojoengine/create-burner";
import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Account, RpcProvider } from "starknet";
import { setup, SetupResult } from "../dojo/setup";
import { setDojoConfig, useSettingsStore } from "@/global/settings.store.ts";
import { getComponentEntities, getComponentValue } from "@dojoengine/recs";
import { felt252ToString } from "@/global/utils.ts";
import { DojoProvider, createDojoConfig } from "@dojoengine/core";
import { useQuery } from "@tanstack/react-query";

export type TPixelLawError = Error & {type: "DojoStateError" | "ConfigError"};

export interface IPixelawGameData {
    _setupResult: SetupResult;
    dojoProvider: DojoProvider;
    masterAccount: Account;
    account: ReturnType<typeof useBurnerManager>;
}

export type IPixelLawContext = {
    clientState: "worldSelect" | "loading" | "error" | "gameActive";
    error: TPixelLawError | Error | string | undefined;
    gameData: IPixelawGameData | undefined;
    account: ReturnType<typeof useBurnerManager>;
}

export const PixelawContext = createContext<IPixelLawContext | null>(null);

async function getAbi(provider: RpcProvider, app: any): Promise<any> {
    let name = felt252ToString(app.name).toLowerCase();
    console.log("reloading abi for", name);
    const ch = await provider.getClassHashAt(app.system);
    const cl = await provider.getClass(ch);

    name = `pixelaw::apps::${name}::app::${name}_actions`;

    return {
        kind: "DojoContract",
        address: app.system,
        abi: cl.abi,
        name,
    };
}

export const PixelawProvider = ({ children }: { children: ReactNode}) => {
    const currentValue = useContext(PixelawContext);

    if (currentValue) throw new Error("DojoProvider can only be used once");

    const { config, configIsValid } = useSettingsStore((state) => {
        return {
            config: state.config,
            configIsValid: state.configIsValid,
            configError: state.configError,
        };
    });

    const setupFunction = useCallback(async () => {
        if (!config) {
            throw new Error("Missing valid Dojo config");
        }
        console.log("🏵️ Setting up Dojo 🔨", config);
        const setupData = await setup(createDojoConfig(config!));
        const { clientComponents: { App }} = setupData;
        const entities = getComponentEntities(App);
        const apps: ReturnType<typeof getComponentValue>[] = [];
        for (const entityId of entities) {
            const app = getComponentValue(App, entityId);
            apps.push(app);
        }
        console.log("app:", apps)
        const contracts = await Promise.all(apps.map((address) => getAbi(new RpcProvider({nodeUrl:config!.rpcUrl}), address)));

        console.log("contracts:", contracts)
        
        const manifest = {
            ...config.manifest,
            contracts
        }

        const dojoProvider = new DojoProvider(manifest, config!.rpcUrl);
        if (!config.masterAddress || !config.masterPrivateKey) {
            throw new Error("Missing master account, please set in settings") // TODO move to checkdojoconfig
        }
        const masterAccount = new Account(dojoProvider.provider, config.masterAddress, config.masterPrivateKey, "1")
        const burnerWallet = setupData.burnerManager;
        console.log("burnerWallet:", burnerWallet)
        const { create, list, get, select, clear, account, isDeploying, count, copyToClipboard, applyFromClipboard, remove } = burnerWallet;
        return ({
                    dojoProvider,
                    masterAccount,
                    account: {
                        create,
                        list,
                        get,
                        select,
                        clear,
                        account: account ? account : masterAccount,
                        isDeploying,
                        count,
                        copyToClipboard,
                        applyFromClipboard,
                        remove: function (_address: string): void {
                            throw new Error("Function not implemented.");
                        },
                        deselect: function (): void {
                            throw new Error("Function not implemented.");
                        },
                    });
        return setupData
    }, [config]);

    const setupQuery = useQuery({
        queryKey: ["setupQuery"],
        queryFn: setupFunction,
        enabled: config !== undefined && configIsValid,
        staleTime: Infinity,
        retry: false, // important: when retrying, dojo can lock up in a setup loop and new queries will never be triggered
    });
    

    // useEffect(() => {
    //     console.log("DojoContext.useEffect");
    //     // if (!appSystems) return
    //     // Retrieve existing manifest
    //     let manifest = { ...config?.manifest };

    //     const fetchAbis = async () => {
    //         console.log({ apps });
    //         const contracts = await Promise.all(apps.map((address) => getAbi(dojoProvider.provider, address)));

    //         manifest.contracts = contracts;

    //         setDojoConfig({ manifest });
    //     };

    //     fetchAbis();
    // }, [appIds]);

    // const dojoValues = useMemo(() => {
    //     if (!dojoProvider || !masterAccount) return null;
    //     return {
    //         ...value,
    //         dojoProvider,
    //         masterAccount,
    //         account: {
    //             create,
    //             list,
    //             get,
    //             select,
    //             clear,
    //             account: account ? account : masterAccount,
    //             isDeploying,
    //             count,
    //             copyToClipboard,
    //             applyFromClipboard,
    //             remove: function (_address: string): void {
    //                 throw new Error("Function not implemented.");
    //             },
    //             deselect: function (): void {
    //                 throw new Error("Function not implemented.");
    //             },
    //         },
    //     };
    // }, [value, config]);


    console.log("Rendering DojoContext");
    
    // return <PixelawContext.Provider value={dojoValues}>{children}</PixelawContext.Provider>;
};

export const usePixelawProvider = () => {
    const context = useContext(PixelawContext);
    if (!context) throw new Error("PixelLawProvider can only be used within a PixelLawProvider");
    return context;
}