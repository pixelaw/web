import { PixelawContext } from "@/providers/PixelawProvider.ts"
import { useContext } from "react"

export const usePixelaw = () => {
    const context = useContext(PixelawContext)
    if (!context) throw new Error("The `usePixelaw` hook must be used within a `DojoProvider`")
    if (!context.gameData) throw new Error("The `usePixelaw` hook must be used within a `PixelawProvider`")
    return {
        setup: context.gameData.setup,
        account: context.gameData.account,
    }
}
