import { DEFAULT_WORLD } from "@/global/constants.ts"
import { type DojoStuff, type Status, useDojo } from "@/stores/DojoStore.js"
import useSettingStore, { type WorldConfig } from "@/stores/SettingStore.ts"

import { type ReactNode, createContext, useContext, useEffect, useState } from "react"

export type IPixelawContext = {
    world: string
    walletType: "" | "argent" | "braavos" | "burner" | "controller" | undefined
    clientState: Status
    clientError: Error | string | null
    dojoStuff: DojoStuff | undefined
    worldConfig: WorldConfig | undefined
}

export const PixelawContext = createContext<IPixelawContext | undefined>(undefined)

export const PixelawProvider = ({ children }: { children: ReactNode }) => {
    const { worldConfig } = useSettingStore()

    const { dojoStuff, status } = useDojo(worldConfig)

    const [contextValues, setContextValues] = useState<IPixelawContext>({
        world: DEFAULT_WORLD,
        walletType: "burner",
        clientState: "loading",
        clientError: null,
        dojoStuff: undefined,
        worldConfig,
    })

    useEffect(() => {
        if (dojoStuff && (status !== "ready" || contextValues.clientState !== "ready")) {
            console.log(status)
            setContextValues((prev) => ({
                ...prev,
                clientState: status,
                dojoStuff,
            }))
        }
    }, [dojoStuff, status, contextValues.clientState])

    return <PixelawContext.Provider value={contextValues}>{children}</PixelawContext.Provider>
}

export const usePixelawProvider = (): IPixelawContext => {
    const context = useContext(PixelawContext)
    if (!context) throw new Error("PixelawProvider can only be used within a PixelawProvider")
    return context
}
