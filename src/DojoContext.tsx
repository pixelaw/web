import { BurnerAccount, useBurnerManager } from "@dojoengine/create-burner";
import {ReactNode, createContext, useContext, useEffect, useMemo, useState} from "react";
import {Account} from "starknet";
import {SetupResult} from "./dojo/setup";
import {setDojoConfig, useSettingsStore} from "@/global/settings.store.ts";
import {useComponentValue, useEntityQuery} from "@dojoengine/react";
import { Has, getComponentValue } from "@dojoengine/recs";
import {felt252ToString} from "@/global/utils.ts";
import {DojoProvider as CoreDojoProvider} from "@dojoengine/core";

interface DojoContextType extends SetupResult {
    masterAccount: Account;
    account: BurnerAccount;
}

export const DojoContext = createContext<DojoContextType | null>(null);

async function getAbi(provider, app) : Promise<any> {
    let name = felt252ToString(app.name).toLowerCase()
    console.log("reloading abi for", name);
    const ch = await provider.getClassHashAt(app.system);
    const cl = await provider.getClass(ch);

    name = `pixelaw::apps::${name}::app::${name}_actions`

    return {
        "kind": "DojoContract",
        "address": app.system,
        "abi": cl.abi,
        name
    }
}

export const DojoContextProvider = (
    {children, value,}: { children: ReactNode; value: SetupResult; }
) => {

    const currentValue = useContext(DojoContext);

    if (currentValue) throw new Error("DojoProvider can only be used once");

    const {
        config: { masterAddress, masterPrivateKey },
        burnerManager,
        dojoProvider: oldDP
    } = value;

    const {config, configIsValid, configError} = useSettingsStore(state => {
        return {
            config: state.config,
            configIsValid: state.configIsValid,
            configError: state.configError
        }
    });

    const [dojoProvider, setDojoProvider] = useState(oldDP);


    const { App } = value.clientComponents
    const appIds = useEntityQuery([Has(App)]);

    const apps = appIds.map(entityId => {
        const app = getComponentValue(App, entityId);
        return app
    })

    useEffect(() => {
        console.log("DojoContext.useEffect")
        // if (!appSystems) return
        // Retrieve existing manifest
        let manifest = {...config?.manifest}

        const fetchAbis = async () => {
            console.log({apps})
            const contracts = await Promise.all(apps.map(address => getAbi(dojoProvider.provider, address)));

            manifest.contracts = contracts;

            setDojoConfig({manifest})
        }

        fetchAbis();

    }, [appIds]);

    useEffect(() => {
        setDojoProvider(new CoreDojoProvider(config!.manifest, config!.rpcUrl));
        console.log("set", config!.manifest)
    }, [config?.manifest]);

    const masterAccount = useMemo(
        () =>
            new Account(
                dojoProvider.provider,
                masterAddress,
                masterPrivateKey,
                "1"
            ),
        [masterAddress, masterPrivateKey]
    );

    const {
        create,
        list,
        get,
        select,
        clear,
        account,
        isDeploying,
        count,
        copyToClipboard,
        applyFromClipboard,
    } = useBurnerManager({
        burnerManager,
    });

    console.log("Rendering DojoContext")



    return (
        <DojoContext.Provider
            value={{
                ...value,
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
                    }
                },
            }}
        >
            {children}
        </DojoContext.Provider>
    );
};
