// import { type PixelawGameData, type TPixelLawError, setupPixelaw } from "@/dojo/setupPixelaw.ts"
// import { useSettingsStore } from "@/stores/SettingsStore.ts"

import useSettingStore, {BurnerConfig, DeploymentConfig} from "@/stores/SettingStore.ts"
import {createDojoConfig, DojoProvider} from "@dojoengine/core"
import { type ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import {Account, RpcProvider} from "starknet";
import type {Manifest} from "@/global/types.js";
import {fetchApps} from "@/stores/DojoAppStore.js";
import {getAbi} from "@/dojo/utils.js";
import baseManifest  from "@/dojo/manifest.js";
import {BurnerManager} from "@dojoengine/create-burner";
import {getSdk} from "@/generated/graphql.js";
import {GraphQLClient} from "graphql-request";

export type DojoStuff = {
    dojoProvider: DojoProvider
    manifest: Manifest
    burnerManager: BurnerManager | null
    userAccount: Account | undefined
}

export type IPixelawContext = {
    deployment: string
    walletType: "argent" | "braavos" | "burner" | "controller" | undefined
    clientState: "worldSelect" | "loading" | "error" | "gameActive"
    clientError: Error | string | null
    dojoStuff: DojoStuff | undefined
    deploymentStuff: DeploymentConfig

}

export const PixelawContext = createContext<IPixelawContext | undefined>(undefined);


// @dev createDojoConfig can only be called once, or we get a full hangup
let activeLoad = false

export const PixelawProvider = ({ children }: { children: ReactNode }) => {

    const { deploymentsConfig, getDeploymentByKey } = useSettingStore();

    const [contextValues, setContextValues] = useState<IPixelawContext>({
        deployment: "local",
        walletType: "burner",
        clientState: "loading",
        clientError: null,
        dojoStuff: undefined,
        deploymentStuff: getDeploymentByKey("local")
    });


    const setupDojo = useCallback(async () => {
        if (activeLoad) return;
        activeLoad = true;

        try {
            let burnerManager: BurnerManager
            let userAccount: Account

            const deployment = getDeploymentByKey(contextValues.deployment)

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

                const { create, list, get, select, clear, account, isDeploying } = burnerManager
                userAccount = account!
            }

            // Create Graph SDK
            const createGraphSdk = () => getSdk(new GraphQLClient(`${deployment.toriiUrl}/graphql`))

            setContextValues((prev) => ({
                ...prev,
                clientState: "gameActive",
                clientError: null,
            dojoStuff: {
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
    }, [deploymentsConfig]);

    useEffect(() => {
        if (deploymentsConfig && contextValues.deployment) {
            setupDojo();
        }
    }, [deploymentsConfig]);


    return <PixelawContext.Provider value={contextValues}>{children}</PixelawContext.Provider>
}

export const usePixelawProvider = (): IPixelawContext => {
    const context = useContext(PixelawContext)
    if (!context) throw new Error("PixelLawProvider can only be used within a PixelLawProvider")
    return context
}
