import { type DojoCall } from '@dojoengine/core';
import { type ParamDefinitionType } from '@/dojo/utils/Instruction.ts';
import { ZERO_ADDRESS } from '@/global/constants.ts';
import { type Manifest, type Position } from '@/global/types.ts';

export function generateDojoCall(
    params: ParamDefinitionType[],
    manifest: Manifest,
    contractName: string,
    action: string,
    position: Position,
    color: number,
): DojoCall {
    const defaultParams = [ZERO_ADDRESS, ZERO_ADDRESS, position.x, position.y, color];

    return {
        contractName,
        entrypoint: action,
        calldata: defaultParams,
    };
}
