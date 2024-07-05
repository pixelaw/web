import {Manifest, Position} from "@/global/types.ts";
import {DojoCall} from "@dojoengine/core";
import getParamsDef from "@/dojo/utils/paramsDef.ts";
import {Calldata, RawArgs} from "starknet";
import {ParamDefinitionType} from "@/dojo/utils/Instruction.ts";
import {ZERO_ADDRESS} from "@/global/constants.ts";

export function generateDojoCall(
    params: ParamDefinitionType[],
    paramData: any | null,
    contractName: string,
    action: string,
    position: Position,
    color: number
): DojoCall {

    const calldata = [
        ZERO_ADDRESS,
        ZERO_ADDRESS,
        position.x,
        position.y,
        color,
    ]

    // Add the params, if any, to the CallData
    if (paramData) {
        params.forEach(param => {
            if (paramData[param.name] !== undefined) {
                const value = param.transformValue ? param.transformValue(paramData[param.name]) : paramData[param.name];
                calldata.push(value);
            }
        });
    }

    return {
        contractName,
        entrypoint: action,
        calldata
    }

}