import Apps from "@/components/Viewport/Apps/Apps.tsx"
import SimpleColorPicker from "@/components/Viewport/ColorPicker/SimpleColorPicker.tsx"
import ParamDialog from "@/components/Viewport/ParamDialog/ParamDialog.tsx"
import { useDojoInteractHandler } from "@/hooks/useDojoInteractHandler.js"
import { usePixelawProvider } from "@/providers/PixelawProvider.js"
import { useDojoAppStore } from "@/stores/DojoAppStore.ts"
import { useDojoPixelStore } from "@/stores/DojoPixelStore.ts"

import { useSyncedViewStateStore, useViewStateStore } from "@/stores/ViewStateStore.ts"
import Viewport from "@/webtools/components/Viewport/ViewPort.tsx"
import { useSimpleTileStore } from "@/webtools/hooks/SimpleTileStore.ts"
import { useUpdateService } from "@/webtools/hooks/UpdateService.ts"
import type { Bounds, Coordinate } from "@/webtools/types.ts"
import { useEffect, useMemo, useState } from "react"
import styles from "./ViewportPage.module.css"

const ViewportPage: React.FC = () => {
    //<editor-fold desc="State">

    const [paramDialogVisible, setParamDialogVisible] = useState(false)
    const [paramDialogParams, setParamDialogParams] = useState<any>(null)
    const [submitParamsCallback, setSubmitParamsCallback] = useState<(params: any) => void>(() => () => {})

    //</editor-fold>

    //<editor-fold desc="Hooks">

    const { clientState, clientError, dojoStuff, deploymentStuff } = usePixelawProvider()
    if(clientError) return

    const updateService = useUpdateService(deploymentStuff.serverUrl!)
    const appStore = useDojoAppStore(deploymentStuff.toriiUrl!)
    const pixelStore = useDojoPixelStore(deploymentStuff.toriiUrl!)
    const tileStore = useSimpleTileStore(`${deploymentStuff.serverUrl}/tiles`)
    const { color, setColor, center, setCenter, zoom, setZoom, setHoveredCell, setClickedCell } = useViewStateStore()

    useSyncedViewStateStore()

    const handleParamsRequired = (params: any) => {
        setParamDialogParams(params)
        setParamDialogVisible(true)
    }

    const handleParamSubmit = (submittedParams: any) => {
        submitParamsCallback(submittedParams)
        setParamDialogVisible(false)
    }

    useDojoInteractHandler(pixelStore, dojoStuff!, handleParamsRequired, (submit) => {
        setSubmitParamsCallback(() => submit)
    })

    const closeParamDialog = () => {
        setParamDialogVisible(false)
    }

    //</editor-fold>

    //<editor-fold desc="Handlers">

    useEffect(() => {
        if (!updateService.tileChanged) return
        tileStore.fetchTile(updateService.tileChanged?.tileName)
        pixelStore.refresh()
    }, [updateService.tileChanged, pixelStore.refresh, tileStore.fetchTile])

    const onWorldviewChange = (newWorldview: Bounds) => {
        updateService.setBounds(newWorldview)
        tileStore.prepare(newWorldview)

        if (zoom > 3000) {
            pixelStore.prepare(newWorldview)
        }
    }

    const onCellHover = (coordinate: Coordinate | undefined) => {
        setHoveredCell(coordinate)
    }

    const onCellClick = (coordinate: Coordinate) => {
        setClickedCell(coordinate)
    }

    const onColorSelect = (color: string) => {
        const result = color.replace("#", "")
        setColor(result)
    }

    const zoombasedAdjustment = useMemo(() => {
        if (zoom > 3000) {
            return "1rem"
        }
        return "-100%"
    }, [zoom])

    //</editor-fold>

    //<editor-fold desc="Output">

    return (
        <>
            <Viewport
                tileset={tileStore.tileset}
                pixelStore={pixelStore}
                zoom={zoom}
                setZoom={setZoom}
                center={center}
                setCenter={setCenter}
                onWorldviewChange={onWorldviewChange}
                onCellClick={onCellClick}
                onCellHover={onCellHover}
            />
            <div
                className={styles.colorpicker}
                style={{ bottom: zoombasedAdjustment }}
            >
                <SimpleColorPicker
                    color={color}
                    onColorSelect={onColorSelect}
                />
            </div>
            <div
                className={styles.apps}
                style={{ left: zoombasedAdjustment }}
            >
                <Apps appStore={appStore} />
            </div>
            {paramDialogVisible && (
                <ParamDialog
                    params={paramDialogParams}
                    onSubmit={handleParamSubmit}
                    onClose={closeParamDialog}
                />
            )}
        </>
    )
    //</editor-fold>
}

export default ViewportPage
