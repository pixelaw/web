import Apps from "@/components/Viewport/Apps/Apps.tsx"
import SimpleColorPicker from "@/components/Viewport/ColorPicker/SimpleColorPicker.tsx"
import ParamDialog from "@/components/Viewport/ParamDialog/ParamDialog.tsx"
import { useDojoInteractHandler } from "@/hooks/useDojoInteractHandler.js"
import { usePixelawProvider } from "@/providers/PixelawProvider.js"
import { useDojoAppStore } from "@/stores/DojoAppStore.ts"
import { useSyncedViewStateStore, useViewStateStore } from "@/stores/ViewStateStore.ts"
import Viewport from "@/webtools/components/Viewport/ViewPort.tsx"
import { useSimpleTileStore } from "@/webtools/hooks/SimpleTileStore.ts"
import { useUpdateService } from "@/webtools/hooks/UpdateService.ts"
import type { Bounds } from "@/webtools/types.ts"
import { useCallback, useEffect, useMemo, useState } from "react"
import styles from "./ViewportPage.module.css"
import { PixelStore } from "@/stores/PixelStore"

const ViewportPage: React.FC = () => {
    //<editor-fold desc="State">

    const [paramDialogVisible, setParamDialogVisible] = useState(false)
    const [paramDialogParams, setParamDialogParams] = useState<unknown>(null)
    const [submitParamsCallback, setSubmitParamsCallback] = useState<(params: unknown) => void>(() => () => {})

    //</editor-fold>

    //<editor-fold desc="Hooks">

    const { clientError, worldConfig } = usePixelawProvider()
    if (clientError) return
    if (!worldConfig) return

    const updateService = useUpdateService(worldConfig.serverUrl!)
    const appStore = useDojoAppStore()

    const tileStore = useSimpleTileStore(`${worldConfig.serverUrl}/tiles`)
    const { color, center, setCenter, zoom } = useViewStateStore()

    useSyncedViewStateStore()

    const handleParamsRequired = (params: unknown) => {
        setParamDialogParams(params)
        setParamDialogVisible(true)
    }

    const handleParamSubmit = (submittedParams: unknown) => {
        submitParamsCallback(submittedParams)
        setParamDialogVisible(false)
    }

    useDojoInteractHandler(handleParamsRequired, (submit) => {
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
        PixelStore().refresh()
    }, [updateService.tileChanged, tileStore.fetchTile])

    const onWorldviewChange = useCallback((newWorldview: Bounds) => {
        updateService.setBounds(newWorldview)
        tileStore.prepare(newWorldview)

        // if (zoom > 3000) {
            PixelStore().prepare(newWorldview)
        // }
    }, [updateService.setBounds, tileStore.prepare, zoom])

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
                zoom={zoom}
                setZoom={useViewStateStore.getState().setZoom}
                center={center}
                setCenter={setCenter}
                onWorldviewChange={onWorldviewChange}
                onCellClick={useViewStateStore.getState().setClickedCell}
                onCellHover={useViewStateStore.getState().setHoveredCell}
            />
            <div className={styles.colorpicker} style={{ bottom: zoombasedAdjustment }}>
                <SimpleColorPicker color={color} onColorSelect={useViewStateStore.getState().setColor} />
            </div>
            <div className={styles.apps} style={{ left: zoombasedAdjustment }}>
                <Apps appStore={appStore} />
            </div>
            {paramDialogVisible && (
                <ParamDialog params={paramDialogParams} onSubmit={handleParamSubmit} onClose={closeParamDialog} />
            )}
        </>
    )
    //</editor-fold>
}

export default ViewportPage
