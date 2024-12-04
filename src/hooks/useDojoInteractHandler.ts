import { generateDojoCall } from "@/dojo/utils/call.ts"
import getParamsDef from "@/dojo/utils/paramsDef.ts"
import { NAMESPACE } from "@/global/constants.js"
import { coordinateToPosition, hexRGBtoNumber } from "@/global/utils.ts"
import { useDojoAppStore } from "@/stores/DojoAppStore.ts"
import { useViewStateStore } from "@/stores/ViewStateStore.ts"
import type { PixelStore } from "@/webtools/types.ts"
import type { DojoCall } from "@dojoengine/core"
import { useCallback, useEffect, useState } from "react"
import {DojoStuff} from "@/providers/PixelawProvider.tsx";

export const useDojoInteractHandler = (
    pixelStore: PixelStore,
    dojoStuff: DojoStuff,
    onParamsRequired: (params: any) => void,
    onSubmitParams: (submitParams: (params: any) => void) => void,
) => {
    const { setClickedCell, clickedCell, selectedApp, color } = useViewStateStore()
    const { getByName } = useDojoAppStore()
    const [paramData, setParamData] = useState(null)

    // Callback to be called with submitted parameters
    const submitParams = useCallback((params: any) => {
        setParamData(params)
    }, [])

    useEffect(() => {
        // Call the passed-in callback with the submitParams function
        onSubmitParams(submitParams)
    }, [submitParams, onSubmitParams])

    useEffect(() => {
        if (!clickedCell || !selectedApp) return

        console.log(`Clicked cell ${clickedCell} with app: ${selectedApp}`)

        // Retrieve info of the pixel
        const pixel = pixelStore.getPixel(clickedCell)

        // If the pixel is not set, or the action is not overridden, use the default "interact"
        const action = pixel && pixel.action !== "0" ? pixel.action : "interact"

        const contractName = `${selectedApp}_actions`
        const position = coordinateToPosition(clickedCell)

        const params = getParamsDef(dojoStuff.manifest, contractName, action, position, false)

        if (params.length && !paramData) {
            onParamsRequired(params) // Use the callback to pass parameters where needed
            console.log("req")
            return // Stop further execution until params are handled
        }

        console.log("pd", paramData)
        // Generate the DojoCall
        const dojoCall: DojoCall = generateDojoCall(
            params,
            paramData,
            contractName,
            action,
            coordinateToPosition(clickedCell),
            hexRGBtoNumber(color),
        )

        // Execute the call
        dojoStuff.dojoProvider.execute(dojoStuff.userAccount!, dojoCall, NAMESPACE, {})
            .then((res) => {
            console.log("dojocall", res)

            pixelStore.setPixelColor(clickedCell, hexRGBtoNumber(color))
            pixelStore.setCacheUpdated(Date.now())

            // Reset paramData after execution
            setParamData(null)
        })
            .catch((error) => {
                console.error("Error executing DojoCall:", error)
                // Handle the error appropriately here
            })
        // Immediately restore state, without waiting for the txn to complete
        setClickedCell(undefined)
    }, [setClickedCell, clickedCell, paramData])
}
