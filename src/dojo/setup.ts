import {getSyncEntities} from "@dojoengine/state";
import {DojoConfig, DojoProvider} from "@dojoengine/core";
import * as torii from "@dojoengine/torii-client";
import {createClientComponents} from "./createClientComponents";
import {createSystemCalls} from "./createSystemCalls";
import {defineContractComponents} from "./contractComponents";
import {world} from "./world";
import {setupWorld} from "./generated";
import {Account} from "starknet";
import {BurnerManager} from "@dojoengine/create-burner";
import {getSdk} from '@/generated/graphql'
import {GraphQLClient} from 'graphql-request'
import {PUBLIC_TORII} from '@/global/constants'


export type SetupResult = Awaited<ReturnType<typeof setup>>;

export async function setup({...config}: DojoConfig) {
    console.group('setup');

    console.log("torii.createClient", config.manifest.world.address)

    // torii client
    const toriiClient = await torii.createClient([], {
        rpcUrl: config.rpcUrl,
        toriiUrl: config.toriiUrl,
        worldAddress: config.manifest.world.address || "",
        relayUrl: "",
    });
    const contractComponents = defineContractComponents(world);
    const clientComponents = createClientComponents({contractComponents});
    await getSyncEntities(toriiClient, contractComponents as any);
    console.log(config.manifest)
    const dojoProvider = new DojoProvider(config.manifest, config.rpcUrl);
    const client = await setupWorld(dojoProvider);

    const burnerManager = new BurnerManager({
        masterAccount: new Account(
            dojoProvider.provider,
            config.masterAddress,
            config.masterPrivateKey
        ),
        accountClassHash: config.accountClassHash,
        rpcProvider: dojoProvider.provider,
        feeTokenAddress: config.feeTokenAddress
    });

    await burnerManager.init();
    if (burnerManager.list().length === 0) {
        try {
            await burnerManager.create();
        } catch (e) {
            console.error(e);
        }
    }

    const createGraphSdk = () => getSdk(new GraphQLClient(`${PUBLIC_TORII}/graphql`));

    console.groupEnd();

    return {
        client,
        clientComponents,
        contractComponents,
        // Define the graph SDK instance.
        graphSdk: createGraphSdk(),
        systemCalls: createSystemCalls(
            {client}
        ),
        config,
        dojoProvider,
        burnerManager
    };
}
