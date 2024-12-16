import ControllerConnector from "@cartridge/connector/controller"
import { type Manifest, getContractByName } from "@dojoengine/core"

interface ConnectorParams {
    rpcUrl: string
    feeTokenAddress: string
    url: string
    profileUrl: string
    manifest: Manifest
}

export const getControllerConnector = ({
    rpcUrl,
    feeTokenAddress,
    manifest,
    url,
    profileUrl,
}: ConnectorParams): ControllerConnector => {
    const policies = [
        {
            target: feeTokenAddress,
            method: "approve",
        },
        {
            target: feeTokenAddress,
            method: "approve",
            description: "approve",
        },
        {
            target: feeTokenAddress,
            method: "transfer",
        },
        {
            target: feeTokenAddress,
            method: "mint",
        },
        {
            target: feeTokenAddress,
            method: "burn",
        },
        {
            target: feeTokenAddress,
            method: "allowance",
        },
    ]

    for (const contract of manifest.contracts) {
        policies.push({
            target: contract.address,
            method: "interact",
            description: `Interact with ${contract.name}`,
        })
    }

    const rpc = rpcUrl

    return new ControllerConnector({
        policies,
        rpc,
        url,
        profileUrl,
        slot: "pixelaw-slot",
        preset: "pixelaw",
        namespace: "pixelaw",
        tokens: {
            erc20: [
                // $LORDS
                // "0x0124aeb495b947201f5fac96fd1138e326ad86195b98df6dec9009158a533b49",
                // $FLIP
                // "0x01bfe97d729138fc7c2d93c77d6d1d8a24708d5060608017d9b384adf38f04c7",
            ],
        },
    })
}
