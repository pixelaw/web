import { type DojoStuff, type Status, useDojo } from "@/stores/DojoStore.js"
import useSettingStore, { type WorldConfig } from "@/stores/SettingStore.ts"

import { type ReactNode, createContext, useContext, useEffect, useState } from "react"

export type IPixelawContext = {
    world: string
    worldConfig: WorldConfig | undefined
    walletType: "" | "argent" | "braavos" | "burner" | "controller" | undefined
    clientState: Status
    clientError: Error | string | null
    dojoStuff: DojoStuff | undefined
    setWorld: (id: string) => void
}

export const PixelawContext = createContext<IPixelawContext | undefined>(undefined)

export const PixelawProvider = ({ children }: { children: ReactNode }) => {
    const { setWallet, setWorld, worldConfig, world } = useSettingStore()

    const { dojoStuff, status } = useDojo(worldConfig)

    const [contextValues, setContextValues] = useState<IPixelawContext>({
        world,
        worldConfig,
        walletType: "",
        clientState: "loading",
        clientError: null,
        dojoStuff: undefined,
        setWorld: (id: string) => {
            setWallet("")
            setWorld(id)
            setContextValues((prev) => ({
                ...prev,
                world: id,
                walletType: "",
            }))
        },
    })

    useEffect(() => {
        if (dojoStuff && (status !== "ready" || contextValues.clientState !== "ready")) {
            console.log(status)
            setContextValues((prev) => ({
                ...prev,
                clientState: status,
                dojoStuff,
                world: world,
            }))
        }
    }, [dojoStuff, status, contextValues.clientState, world])

    return <PixelawContext.Provider value={contextValues}>{children}</PixelawContext.Provider>
}

export const usePixelawProvider = (): IPixelawContext => {
    const context = useContext(PixelawContext)
    if (!context) throw new Error("PixelawProvider can only be used within a PixelawProvider")
    return context
}
