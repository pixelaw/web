import type { IWorld } from "@/dojo/generated.ts"
import { ZERO_ADDRESS } from "@/global/constants.ts"
import type { AccountInterface, num } from "starknet"

const FAILURE_REASON_REGEX = /Failure reason: ".+"/

export type SystemCalls = ReturnType<typeof createSystemCalls>

export function createSystemCalls({ client }: { client: IWorld }) {
    /**
     * @notice calls an action in a specific pixel
     * @dev the only value being optimistically rendered is color
     * @param signer is the account that's calling an action
     * @param contractName is the name of the contract that owns the action being called
     * @param position is where the pixel is located
     * @param color is expressed in argb
     * @param action is the function being called (defaults to interact)
     * @param otherParams are other param meters that follow the defaultParams
     * */
    const interact = async (
        signer: AccountInterface,
        contractName: string,
        position: { x: number; y: number },
        color: number,
        action = "interact",
        otherParams?: num.BigNumberish[],
    ) => {
        try {
            const tx = await client.actions.interact({
                account: signer,
                contract_name: contractName,
                call: action,
                calldata: [ZERO_ADDRESS, ZERO_ADDRESS, position.x, position.y, color, ...(otherParams ?? [])],
            })

            const receipt = await signer.waitForTransaction(tx.transaction_hash, { retryInterval: 100 })

            if ("execution_status" in receipt && receipt.statusReceipt === "reverted") {
                if ("revert_reason" in receipt && !!receipt.revert_reason) {
                    throw receipt.revert_reason.match(FAILURE_REASON_REGEX)?.[0] ?? receipt.revert_reason
                }
                throw new Error("transaction reverted")
            }

            if (receipt.statusReceipt === "rejected") {
                if ("transaction_failure_reason" in receipt) throw receipt.transaction_failure_reason.error_message
                throw new Error("transaction rejected")
            }
        } catch (e) {
            console.error(e)
            throw e
        }
    }

    return {
        interact,
    }
}
