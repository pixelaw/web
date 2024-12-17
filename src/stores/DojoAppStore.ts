import type { App, AppStore } from "@/webtools/types.ts"

import { usePixelawProvider } from "@/providers/PixelawProvider.tsx"

export function useDojoAppStore(): AppStore {
    const { dojoStuff } = usePixelawProvider()

    const getByName = (name: string): App | undefined => {
        return dojoStuff!.apps.find((app) => app.name === name)
    }

    const getAll = (): App[] => {
        return dojoStuff!.apps
    }

    return { getByName, getAll }
}
