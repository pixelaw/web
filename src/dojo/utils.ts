import { felt252ToString } from "@/global/utils.ts"
import type { RpcProvider } from "starknet"
export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
}
export async function getAbi(provider: RpcProvider, app: any): Promise<any> {
    let name = felt252ToString(app.name).toLowerCase()

    const ch = await provider.getClassHashAt(app.system)
    const cl = await provider.getClass(ch)

    const tag = `pixelaw-${name}_actions`
    name = `pixelaw::apps::${name}::app::${name}_actions`

    return {
        kind: "DojoContract",
        address: app.system,
        abi: cl.abi,
        name,
        tag,
    }
}
