import { DojoSQLPixelStore } from "@/stores/_DojoSqlStore"
import { type DojoStuff, type Status, useDojo } from "@/stores/DojoStore.js"
import { PixelStore } from "@/stores/PixelStore"
import useSettingStore, { type WorldConfig } from "@/stores/SettingStore.ts"
import { type ReactNode, createContext, useContext, useEffect, useState } from "react"

export type IPixelawContext = {
    world: string
    worldConfig: WorldConfig | undefined
    walletType: "" | "argent" | "braavos" | "burner" | "controller" | undefined
    clientState: Status
    clientError: Error | string | null
    dojoStuff: DojoStuff | undefined // FIXME: this is still hooked on it being dojo
    pixelStore: typeof PixelStore
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
        dojoStuff: undefined, // FIXME: this is still hooked on it being dojo
        pixelStore: PixelStore,
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
        console.count("PixelawProvider")
        if (dojoStuff && (status !== "ready" || contextValues.clientState !== "ready")) {
            console.count(`PixelawProvider ${status}`)
            setContextValues((prev) => ({
                ...prev,
                clientState: status,
                dojoStuff, // FIXME: this is still hooked on it being dojo
                world: world,
            }))
            
        }
        // FIXME: we need to determine whether we have the right store for the 'dojo' SDK or another store, right now we don't know why we're setting something up
        if (dojoStuff && (status === "ready" || contextValues.clientState === "ready") && PixelStore()?.status?.() !== "loading") {
            const setupStore = async () => {
                console.log("asdf")
                await PixelStore().unload?.();
                PixelStore().setStore(new DojoSQLPixelStore(dojoStuff.sdk!))
            }
            setupStore();
        }
    }, [dojoStuff, status, contextValues.clientState, world])

    return <PixelawContext.Provider value={contextValues}>{children}</PixelawContext.Provider>
}

export const usePixelawProvider = (): IPixelawContext => {
    const context = useContext(PixelawContext)
    if (!context) throw new Error("PixelawProvider can only be used within a PixelawProvider")
    return context
}
