import {Provider, RpcProvider, Contract, shortString} from 'starknet';

const NODE_URL="http://localhost:5050"
const WORLD_ADDRESS = '0xfea84b178ab1dc982ef9e369246f8c4d53aea52ea7af08879911f436313e4e';

const provider = new RpcProvider({ nodeUrl: NODE_URL });

const { abi: worldAbi } = await provider.getClassAt(WORLD_ADDRESS);

if (worldAbi === undefined) {
    throw new Error('no abi.');
}
const world = new Contract(worldAbi, WORLD_ADDRESS, provider);

const world_metadata_url = (await world.metadata(0)).metadata_uri
    .slice(0,-1)
    .reduce((acc, str) => acc + shortString.decodeShortString(str), '');

const world_metadata = await getIpfs(world_metadata_url)

const world_abi = await getIpfs(world_metadata.artifacts.abi)

console.log(worldAbi)

async function getIpfs(url: string) : Promise<string> {
    url = url.replace("ipfs://", "https://cartridge.infura-ipfs.io/ipfs/")
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
}