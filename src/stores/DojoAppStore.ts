import { usePixelawProvider } from "@/providers/PixelawProvider.tsx"
import type { App, AppStore } from "@/webtools/types.ts"
import { felt252ToUnicode } from "@/webtools/utils.ts"
import type { ComponentValue, Schema, getComponentValue } from "@dojoengine/recs"
import { useEffect, useState } from "react"
import { shortString } from "starknet"

export function useDojoAppStore(): AppStore {
    const { gameData } = usePixelawProvider()
    const [preparedApps, setPreparedApps] = useState<App[]>([])

    useEffect(() => {
        if (!gameData) return

        const apps = gameData.setup.apps.reduce(
            (acc: App[], appComponent: ComponentValue<Schema, unknown> | undefined) => {
                const app = fromComponent(appComponent)
                if (app) acc.push(app)
                return acc
            },
            [],
        )

        setPreparedApps(apps)
    }, [gameData])

    const prepare = (): void => {
        // Not implemented for Dojo
    }

    const getByName = (name: string): App | undefined => {
        return preparedApps.find((app) => app.name === name)
    }

    const getAll = (): App[] => {
        return preparedApps
    }

    return { getByName, getAll, prepare }
}

function fromComponent(appComponent: ReturnType<typeof getComponentValue>): App | undefined {
    if (!appComponent) return undefined
    return {
        name: shortString.decodeShortString(appComponent.name),
        icon: felt252ToUnicode(appComponent.icon),
        action: shortString.decodeShortString(appComponent.action),
        system: appComponent.system,
        manifest: appComponent.manifest,
        entity: {
            id: "", // For now there's no reason
        },
    }
}
