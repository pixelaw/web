import {usePixelaw} from '@/dojo/usePixelaw.ts'
import {useMutation} from '@tanstack/react-query'
import {convertToDecimal, felt252ToString} from '@/global/utils'
import { getComponentValue} from '@dojoengine/recs'
import { sleep, uuid} from '@/utils/'
import { getEntityIdFromKeys} from '@dojoengine/utils'
import { num, selector, shortString} from 'starknet'
import {useToast} from '@/components/ui/use-toast'
import {useComponentValue} from '@dojoengine/react'
import getParamsDef from "@/hooks/utils/paramsDef.ts"

/// @dev this does not handle struct params yet...will support this on a later iteration
const useInteract = (
    appName: string,
    color: string,
    position: { x: number, y: number }
) => {

    const {
        setup: {
            systemCalls: {interact},
            clientComponents: {Pixel, AppName, Instruction},
            manifest,
        },
        account: {account}

    } = usePixelaw()


    const {toast} = useToast()

    const contractName = `${appName}_actions`

    const solidColor = color.replace('#', '0xFF')
    const decimalColor = convertToDecimal(solidColor)

    const entityId = getEntityIdFromKeys([BigInt(position.x), BigInt(position.y)])
    const pixelValue = getComponentValue(Pixel, entityId)

    const action = (!pixelValue?.action || pixelValue?.action.toString() === '0x0') ? 'interact' : pixelValue.action
    const methodName = felt252ToString(action)

    const paramsDef = getParamsDef(manifest, contractName, methodName, position)

    const fillableParamDefs = paramsDef.filter(paramDef => paramDef?.value == null)

    const contractAddress = useComponentValue(AppName, getEntityIdFromKeys([BigInt(shortString.encodeShortString(appName))]))

    const instruction = useComponentValue(Instruction, getEntityIdFromKeys([
        BigInt(contractAddress?.system ?? '0x0'),
        BigInt(selector.getSelectorFromName(methodName))
    ]))

    return {
        interact: useMutation({
            mutationKey: ['useInteract', contractName, color],
            mutationFn: async ({otherParams}: {
                otherParams?: Record<string, any>
            }) => {

                const entityId = getEntityIdFromKeys([BigInt(position.x), BigInt(position.y)])
                const pixelId = uuid()
                Pixel.addOverride(pixelId, {
                    entity: entityId,
                    value: {
                        color: decimalColor,
                        x: position.x,
                        y: position.y,
                        owner: BigInt(account!.address),
                    }
                })


                if (!otherParams && fillableParamDefs.length > 0) throw new Error('incomplete parameters')
                const additionalParams: num.BigNumberish[] = []

                for (const paramDef of paramsDef) {
                    if (paramDef.value) {
                        additionalParams.push(paramDef.value)
                    } else {
                        if (!otherParams) continue
                        let param = otherParams[paramDef.name]
                        if (!param && paramDef.variants.length) {
                            param = paramDef.variants[0].value
                        }
                        if (
                            (paramDef.type === 'string' && typeof param !== 'string') ||
                            (paramDef.type === 'number' && typeof param !== 'number')
                        ) throw new Error(`incorrect parameter for ${paramDef.name}. supplied is ${param}`)

                        // TODO handle structs
                        if (paramDef.transformValue) {
                            additionalParams.push(paramDef.transformValue(param))
                        } else additionalParams.push(param)
                    }
                }

                // TODO: add sleep for now so that nonce issue is mitigated
                await sleep(1_000)
                const interaction = `${appName}.${methodName}`
                try {
                    await interact(account, contractName, position, decimalColor, methodName, additionalParams)
                    const paramsList = additionalParams.length ? ` with params: [${additionalParams.join(", ")}]` : ''
                    toast({
                        title: 'Successful Transaction',
                        description: `${interaction}${paramsList} was successful`
                    })
                } catch (e) {
                    toast({
                        variant: "destructive",
                        title: 'Failed Transaction',
                        description: e?.toString() ?? `${interaction} could not be completed`
                    })
                    throw e
                } finally {
                    Pixel.removeOverride(pixelId)
                }

            }
        }),
        params: fillableParamDefs,
        instruction: felt252ToString(instruction?.instruction ?? '0x0')
    }
}

export default useInteract
