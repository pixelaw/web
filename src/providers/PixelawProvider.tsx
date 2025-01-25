import { PixelawCore } from "@/core/PixelawCore.ts"
import type { CoreStatus, WorldConfig } from "@/core/types.ts"
import useSettingStore from "@/stores/SettingStore.ts"
import { type ReactNode, createContext, useContext, useEffect, useState } from "react"

export type IPixelawContext = {
    world: string
    worldConfig: WorldConfig
    walletType: "" | "argent" | "braavos" | "burner" | "controller" | undefined
    setWorld: (id: string) => void
    pixelawCore: PixelawCore
    coreStatus: CoreStatus
}

export const PixelawContext = createContext<IPixelawContext | undefined>(undefined)

export const PixelawProvider = ({ children }: { children: ReactNode }) => {
    const { setWallet, setWorld, worldConfig, world } = useSettingStore()
    const [pixelawCore] = useState(() => new PixelawCore()) // Initialize PixelawCore
    // const [coreStatus, setCoreStatus] = useState<CoreStatus>("uninitialized") // Initialize coreStatus

    const [contextValues, setContextValues] = useState<IPixelawContext>({
        world,
        worldConfig,
        walletType: "",
        setWorld: (id: string) => {
            setWallet("")
            setWorld(id)
            setContextValues((prev) => ({
                ...prev,
                world: id,
                walletType: "",
            }))
        },
        pixelawCore,
        coreStatus: "uninitialized",
    })

    useEffect(() => {
        const handleStatusChange = (newStatus: CoreStatus) => {
            setContextValues((prev) => ({
                ...prev,
                coreStatus: newStatus,
            }))
            console.log("CoreStatus: ", newStatus)
        }

        if (worldConfig && pixelawCore) {
            console.log("loading provider")

            pixelawCore.loadWorld(worldConfig).catch((error) => {
                console.error("Failed to load world:", error)
                setContextValues((prev) => ({
                    ...prev,
                    clientState: "error",
                    clientError: error,
                }))
            })
        }

        pixelawCore.events.on("statusChange", handleStatusChange)
        return () => {
            pixelawCore.events.off("statusChange", handleStatusChange)
        }
    }, [worldConfig, pixelawCore])

    return <PixelawContext.Provider value={contextValues}>{children}</PixelawContext.Provider>
}

export const usePixelawProvider = (): IPixelawContext => {
    const context = useContext(PixelawContext)
    if (!context) throw new Error("usePixelawProvider can only be used within a PixelawProvider")
    return context
}
