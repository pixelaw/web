import type { ParamDefinitionType } from "@/dojo/utils/Instruction.ts"
import getParamsDef from "@/dojo/utils/paramsDef.ts"
import { ZERO_ADDRESS } from "@/global/constants.ts"
import { Manifest, type Position } from "@/global/types.ts"
import type { DojoCall } from "@dojoengine/core"
import { Calldata, RawArgs } from "starknet"

export function generateDojoCall(
    params: ParamDefinitionType[],
    paramData: any | null,
    contractName: string,
    action: string,
    position: Position,
    color: number,
): DojoCall {
    const calldata = [ZERO_ADDRESS, ZERO_ADDRESS, position.x, position.y, color]

    // Add the params, if any, to the CallData
    if (paramData) {
        params.forEach((param) => {
            if (paramData[param.name] !== undefined) {
                const value = param.transformValue ? param.transformValue(paramData[param.name]) : paramData[param.name]
                calldata.push(value)
            }
        })
    }

    return {
        contractName,
        entrypoint: action,
        calldata,
    }
}
