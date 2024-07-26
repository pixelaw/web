import { overridableComponent } from "@dojoengine/recs"
import type { ContractComponents } from "./contractComponents.ts"

export type ClientComponents = ReturnType<typeof createClientComponents>

export function createClientComponents({
    contractComponents,
}: {
    contractComponents: ContractComponents
}) {
    return {
        ...contractComponents,
        Pixel: overridableComponent(contractComponents.Pixel),
    }
}
