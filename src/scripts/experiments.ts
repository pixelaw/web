import { writeFileSync } from 'fs';

import {Account, AccountInterface, CompiledSierra, Contract, LegacyContractClass, RpcProvider} from "starknet"
import {getAbi} from "@/dojo/utils.js";
import {generateTypescriptDefinitions} from "@/scripts/processManifest.js";
import {createWorldProxy} from "@/scripts/execute.js";

const provider= new RpcProvider({ nodeUrl: "http://localhost:5050" })
const pSepolia= new RpcProvider({ nodeUrl: "https://starknet-sepolia.public.blastapi.io/rpc/v0_7" })

const wSepolia = "0x6f38d5d9507c5d9546290e1a27e309efe5a9af3770b6cc1627db4a1b90a7dce"
const worldAddress= "0x2bf4d3aa0dced89d37d8c3b4ff6a05895c0af32ff3baf9b02abf8504e53eaad"
const ch1 = "0x6f38d5d9507c5d9546290e1a27e309efe5a9af3770b6cc1627db4a1b90a7dce"
const chPaint = "0x2cebb25adf8fe48de7d7797e77f82f8eb7b090b1f354bae20c2c895d2043461"


async function getContractForAddress(address: string){
    const c = await provider.getClassAt(address)
    const contract = new Contract(
        c.abi,
        address,
        provider
    );

    return contract
}

async function getAll(worldAddress: string): Promise<any>{
    const worldContract = getContractForAddress(worldAddress)

    return worldContract
}

const c= await getAll(worldAddress)

console.log(c)
//
//
// let contractDefinitions = (await pLocal.getClassByHash(chPaint))
// delete contractDefinitions["sierra_program"]
writeFileSync('output.json', JSON.stringify(c))
//
//
// // Assuming you have a provider or account set up
// const providerOrAccount: AccountInterface = {} as any; // replace with actual provider or account
//
// const world = createWorldProxy([contractDefinitions], providerOrAccount);
//
// // Usage example
// async function useWorld() {
//     await world.actions.interact({});
//     await world.actions.move({ direction: "Left" });
//
//     // TypeScript will catch these errors:
//     // @ts-expect-error
//     await world.actions.nonexistentMethod();
//     // @ts-expect-error
//     await world.nonexistentContract.someMethod();
// }
//
// await useWorld()