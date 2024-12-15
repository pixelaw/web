import type {Connector} from "@starknet-react/core";
import CartridgeConnector from "@cartridge/connector";
import ControllerConnector from "@cartridge/connector/controller";
import { Policy } from "@cartridge/controller";
import {getContractByName} from "@dojoengine/core";
import type {ControllerOptions} from "@cartridge/controller";
import {shortString} from "starknet";

interface ConnectorParams {
    rpcUrl: string;
    feeTokenAddress: string;
    manifest: any;
}


export const getConnector = ({
                                 rpcUrl,
                                 feeTokenAddress,
                                 manifest
                             }: ConnectorParams): Connector => {


    const contract = getContractByName(manifest, "pixelaw", "paint_actions");
    if (!contract?.address) {
        throw new Error("pixelaw paint_actions contract not found");
    }
    const paintActionContractAddress = contract.address;

    const policies = [
        {
            target: feeTokenAddress,
            method: "approve",
        },
        {
            target: feeTokenAddress,
            method: "approve",
            description:                "approve",
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
        {
            target: paintActionContractAddress,
            method: "interact",
            description: "Interact with the paint_actions contract",
        },
    ];

    const rpc = rpcUrl;


    const cartridgeConnector = new ControllerConnector({
        policies,
        rpc,
        url:
            process.env.NEXT_PUBLIC_KEYCHAIN_DEPLOYMENT_URL ??
            process.env.NEXT_PUBLIC_KEYCHAIN_FRAME_URL,
        profileUrl:
            process.env.NEXT_PUBLIC_PROFILE_DEPLOYMENT_URL ??
            process.env.NEXT_PUBLIC_PROFILE_FRAME_URL,
        slot: "profile-example",
        preset: "eternum",
        namespace: "dopewars",
        tokens: {
            erc20: [
                // $LORDS
                "0x0124aeb495b947201f5fac96fd1138e326ad86195b98df6dec9009158a533b49",
                // $FLIP
                // "0x01bfe97d729138fc7c2d93c77d6d1d8a24708d5060608017d9b384adf38f04c7",
            ],
        },
    });

    return cartridgeConnector;
};
