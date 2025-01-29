import { type RpcProvider, shortString } from "starknet"
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
export const felt252ToString = (felt252Input: string | number | bigint) => {
    let result = felt252Input

    if (typeof result === "bigint" || typeof result === "object") {
        result = `0x${result.toString(16)}`
    }
    if (result === "0x0" || result === "0") return ""
    if (typeof result === "string") {
        try {
            // biome-ignore lint/suspicious/noControlCharactersInRegex: Somehow null characters are in the string
            return shortString.decodeShortString(result).replace(/^\u0000+/, "")
        } catch (e) {
            return result
        }
    }
    return result.toString()
}

export const formatAddress = (address: string) => {
    if (address.length > 30) {
        return `${address.substr(0, 6)}...${address.substr(address.length - 4, address.length)}`
    }

    return address
}
export const felt252ToUnicode = (felt252: string | number) => {
    const string = felt252ToString(felt252)
    if (string.includes("U+")) {
        const text = string.replace("U+", "")
        const codePoint = Number.parseInt(text, 16)
        return String.fromCodePoint(codePoint)
    }
    return string
}
