import Apps from "@/components/Viewport/Apps/Apps.tsx"
import SimpleColorPicker from "@/components/Viewport/ColorPicker/SimpleColorPicker.tsx"
import ParamDialog from "@/components/Viewport/ParamDialog/ParamDialog.tsx"
import { useDojoInteractHandler } from "@/hooks/useDojoInteractHandler.js"
import { usePixelawProvider } from "@/providers/PixelawProvider.js"
import { useDojoAppStore } from "@/stores/DojoAppStore.ts"
import { useDojoPixelStore } from "@/stores/DojoPixelStore.ts"
import { useSettingsStore } from "@/stores/SettingsStore.ts"
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

    const { clientState, error, gameData } = usePixelawProvider()
    const settings = useSettingsStore()
    const updateService = useUpdateService(settings.config?.serverUrl!)
    const pixelStore = useDojoPixelStore(settings.config?.toriiUrl!)
    const tileStore = useSimpleTileStore(`${settings.config?.serverUrl}/tiles`)
    const { color, setColor, center, setCenter, zoom, setZoom, setHoveredCell, setClickedCell } = useViewStateStore()
    const appStore = useDojoAppStore()
    useSyncedViewStateStore()

    const handleParamsRequired = (params: any) => {
        setParamDialogParams(params)
        setParamDialogVisible(true)
    }

    const handleParamSubmit = (submittedParams: any) => {
        submitParamsCallback(submittedParams) // Use the stored callback to submit parameters
        setParamDialogVisible(false)
    }

    useDojoInteractHandler(pixelStore, gameData, handleParamsRequired, (submit) => {
        setSubmitParamsCallback(() => submit) // Store the submitParams function provided by the hook
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
        pixelStore.prepare(newWorldview)
        tileStore.prepare(newWorldview)
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
